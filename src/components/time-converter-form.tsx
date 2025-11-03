'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
} from '@/components/ui';
import {
  fromUnixSeconds,
  fromUnixMilliseconds,
  fromLocalDatetime,
  fromUTCDatetime,
  formatLocalDatetimeDisplay,
  formatUTCDatetimeDisplay,
  isValidUnixSeconds,
  isValidUnixMilliseconds,
  isValidDatetime,
} from '@/lib/conversions/time';
import type { TimeConversionResult } from '@/lib/conversions/time';
import { cn } from '@/lib/utils';

type TimeUnit = 'unix-seconds' | 'unix-milliseconds' | 'local-datetime' | 'utc-datetime';

interface TimeConverterFormProps {
  /**
   * The default unit to use (display name like "Unix Epoch (Seconds)")
   */
  defaultUnit: string;
  /**
   * Whether this form's tab is currently active
   */
  isActive: boolean;
}

/**
 * Convert display name to internal TimeUnit ID
 */
function getTimeUnitId(displayName: string): TimeUnit {
  switch (displayName) {
    case 'Unix Epoch (Seconds)':
      return 'unix-seconds';
    case 'Unix Epoch (Milliseconds)':
      return 'unix-milliseconds';
    case 'Local Datetime':
      return 'local-datetime';
    case 'UTC Datetime':
      return 'utc-datetime';
    default:
      return 'unix-seconds'; // fallback
  }
}

// Dynamic Zod schema based on selected unit type
const createFormSchema = (unitType: TimeUnit) => {
  const baseSchema = {
    fromUnit: z.string().min(1, 'Please select a time format'),
  };

  switch (unitType) {
    case 'unix-seconds':
      return z.object({
        ...baseSchema,
        value: z
          .string()
          .min(1, 'Please enter a value')
          .refine((val) => isValidUnixSeconds(val), 'Please enter a valid Unix timestamp in seconds'),
      });
    case 'unix-milliseconds':
      return z.object({
        ...baseSchema,
        value: z
          .string()
          .min(1, 'Please enter a value')
          .refine((val) => isValidUnixMilliseconds(val), 'Please enter a valid Unix timestamp in milliseconds'),
      });
    case 'local-datetime':
    case 'utc-datetime':
      return z.object({
        ...baseSchema,
        value: z
          .string()
          .min(1, 'Please select a date and time')
          .refine((val) => isValidDatetime(val), 'Please enter a valid date and time'),
      });
    default:
      return z.object({
        ...baseSchema,
        value: z.string().min(1, 'Please enter a value'),
      });
  }
};

type FormData = {
  value: string;
  fromUnit: string;
};

const timeUnits: Array<{ id: TimeUnit; name: string; description: string }> = [
  {
    id: 'unix-seconds',
    name: 'Unix Epoch (Seconds)',
    description: 'Seconds since January 1, 1970 00:00:00 UTC',
  },
  {
    id: 'unix-milliseconds',
    name: 'Unix Epoch (Milliseconds)',
    description: 'Milliseconds since January 1, 1970 00:00:00 UTC',
  },
  {
    id: 'local-datetime',
    name: 'Local Datetime',
    description: 'Your local timezone date and time',
  },
  {
    id: 'utc-datetime',
    name: 'UTC Datetime',
    description: 'Coordinated Universal Time',
  },
];

export function TimeConverterForm({ defaultUnit, isActive }: TimeConverterFormProps) {
  const [results, setResults] = React.useState<TimeConversionResult | null>(null);
  const [hasConverted, setHasConverted] = React.useState(false);
  const defaultUnitId = getTimeUnitId(defaultUnit);
  const [selectedUnit, setSelectedUnit] = React.useState<TimeUnit>(defaultUnitId);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(createFormSchema(selectedUnit)),
    defaultValues: {
      value: '',
      fromUnit: defaultUnitId,
    },
  });

  const handleConvert = (data: FormData) => {
    try {
      let conversionResult: TimeConversionResult;

      switch (data.fromUnit as TimeUnit) {
        case 'unix-seconds':
          conversionResult = fromUnixSeconds(parseFloat(data.value));
          break;
        case 'unix-milliseconds':
          conversionResult = fromUnixMilliseconds(parseFloat(data.value));
          break;
        case 'local-datetime':
          conversionResult = fromLocalDatetime(data.value);
          break;
        case 'utc-datetime':
          conversionResult = fromUTCDatetime(data.value);
          break;
        default:
          return;
      }

      setResults(conversionResult);
      setHasConverted(true);
    } catch (error) {
      console.error('Conversion error:', error);
      form.setError('value', {
        type: 'manual',
        message: 'Failed to convert. Please check your input.',
      });
    }
  };

  // Update form when defaultUnit changes (e.g., user preferences change)
  React.useEffect(() => {
    const newUnitId = getTimeUnitId(defaultUnit);
    setSelectedUnit(newUnitId);
    form.reset({
      value: '',
      fromUnit: newUnitId,
    });
    setSelectedDate(null);
    setResults(null);
    setHasConverted(false);
  }, [defaultUnit, form]);

  // Auto-focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus input when tab becomes active
  React.useEffect(() => {
    if (isActive) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isActive]);

  // Handle date picker change - auto-convert when date is selected
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    if (date) {
      // Format date to ISO string for conversion
      let dateString: string;

      if (selectedUnit === 'utc-datetime') {
        // For UTC, treat the selected date/time as UTC (not local time)
        // Get the date components from the picker (which are in local time display)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        // Format as ISO string but interpret these values as UTC
        dateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
      } else {
        // For local datetime, format without timezone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        dateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      }

      // Update form value
      form.setValue('value', dateString);

      // Auto-convert immediately
      try {
        let conversionResult: TimeConversionResult;

        if (selectedUnit === 'local-datetime') {
          conversionResult = fromLocalDatetime(dateString);
        } else {
          conversionResult = fromUTCDatetime(dateString);
        }

        setResults(conversionResult);
        setHasConverted(true);
      } catch (error) {
        console.error('Conversion error:', error);
      }
    }
  };

  // Handle unit change: clear results, clear input, focus input, update schema
  const handleUnitChange = (newUnit: string) => {
    const newUnitType = newUnit as TimeUnit;
    setSelectedUnit(newUnitType);
    form.setValue('fromUnit', newUnit);
    form.setValue('value', '');
    setSelectedDate(null);
    setResults(null);
    setHasConverted(false);
    form.clearErrors();

    // Update the form resolver with new schema
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle Enter key press (only for Unix timestamp inputs)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(handleConvert)();
    }
  };

  // Get input config for Unix timestamp inputs
  const getInputConfig = () => {
    if (selectedUnit === 'unix-seconds') {
      return {
        type: 'text' as const,
        placeholder: 'e.g., 1729354800',
        inputMode: 'numeric' as const,
      };
    } else if (selectedUnit === 'unix-milliseconds') {
      return {
        type: 'text' as const,
        placeholder: 'e.g., 1729354800000',
        inputMode: 'numeric' as const,
      };
    }
    return {
      type: 'text' as const,
      placeholder: 'Enter value',
      inputMode: 'text' as const,
    };
  };

  const inputConfig = getInputConfig();

  // Custom input component for DatePicker with calendar icon
  const DatePickerInput = React.forwardRef<
    HTMLInputElement,
    {
      value?: string;
      onClick?: () => void;
      placeholder?: string;
    }
  >(({ value, onClick, placeholder }, ref) => (
    <div className='relative w-full'>
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10',
          'text-base sm:text-lg ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'cursor-pointer'
        )}
      />
      <button
        type='button'
        onClick={onClick}
        className='absolute right-0 top-0 h-10 px-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors'>
        <Calendar className='h-4 w-4' />
      </button>
    </div>
  ));

  DatePickerInput.displayName = 'DatePickerInput';

  return (
    <div className='space-y-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleConvert)} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Unit Select */}
            <FormField
              control={form.control}
              name='fromUnit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Format</FormLabel>
                  <Select onValueChange={handleUnitChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-base sm:text-lg'>
                        <SelectValue placeholder='Select time format' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Value Input */}
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    {selectedUnit === 'local-datetime' || selectedUnit === 'utc-datetime' ? (
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={1}
                        dateFormat={selectedUnit === 'utc-datetime' ? "yyyy-MM-dd HH:mm 'UTC'" : 'yyyy-MM-dd HH:mm'}
                        placeholderText='Select date and time'
                        customInput={<DatePickerInput />}
                        showPopperArrow={false}
                        timeCaption='Time'
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode='select'
                      />
                    ) : (
                      <Input
                        type={inputConfig.type}
                        inputMode={inputConfig.inputMode}
                        placeholder={inputConfig.placeholder}
                        {...field}
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                        className='text-base sm:text-lg'
                        autoComplete='off'
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {(selectedUnit === 'unix-seconds' || selectedUnit === 'unix-milliseconds') && (
            <p className='text-xs text-muted-foreground'>
              Press <kbd className='px-2 py-1 bg-muted rounded text-xs'>Enter</kbd> to convert
            </p>
          )}
          {(selectedUnit === 'local-datetime' || selectedUnit === 'utc-datetime') && (
            <p className='text-xs text-muted-foreground'>Select a date and time to automatically convert</p>
          )}
        </form>
      </Form>

      {/* Results Display */}
      {hasConverted && results && (
        <div className='border-t border-border pt-6'>
          <h3 className='text-lg font-semibold text-foreground mb-4'>Conversion Results</h3>
          <Card className='py-2'>
            <CardContent className='px-2'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                <div
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center gap-2',
                    'transition-colors',
                    'lg:border lg:border-border lg:rounded-md lg:bg-card/50 lg:p-2'
                  )}>
                  <span className='text-xs sm:text-sm font-medium text-muted-foreground min-w-[200px]'>
                    Unix Epoch (Seconds)
                  </span>
                  <span className='font-mono text-xs sm:text-sm text-foreground break-all'>{results.unixSeconds}</span>
                </div>
                <div
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center gap-2',
                    'transition-colors',
                    'lg:border lg:border-border lg:rounded-md lg:bg-card/50 lg:p-2'
                  )}>
                  <span className='text-xs sm:text-sm font-medium text-muted-foreground min-w-[200px]'>
                    Unix Epoch (Milliseconds)
                  </span>
                  <span className='font-mono text-xs sm:text-sm text-foreground break-all'>
                    {results.unixMilliseconds}
                  </span>
                </div>
                <div
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center gap-2',
                    'transition-colors',
                    'lg:border lg:border-border lg:rounded-md lg:bg-card/50 lg:p-2'
                  )}>
                  <span className='text-xs sm:text-sm font-medium text-muted-foreground min-w-[200px]'>
                    Local Datetime
                  </span>
                  <span className='font-mono text-xs sm:text-sm text-foreground break-all'>
                    {formatLocalDatetimeDisplay(results.localDatetime, results.timezone, results.isDST)}
                  </span>
                </div>
                <div
                  className={cn(
                    'flex flex-col sm:flex-row sm:items-center gap-2',
                    'transition-colors',
                    'lg:border lg:border-border lg:rounded-md lg:bg-card/50 lg:p-2'
                  )}>
                  <span className='text-xs sm:text-sm font-medium text-muted-foreground min-w-[200px]'>
                    UTC Datetime
                  </span>
                  <span className='font-mono text-xs sm:text-sm text-foreground break-all'>
                    {formatUTCDatetimeDisplay(results.utcDatetime)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
