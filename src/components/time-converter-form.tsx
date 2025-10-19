'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Card, CardContent } from '@/components/ui/card';

type TimeUnit = 'unix-seconds' | 'unix-milliseconds' | 'local-datetime' | 'utc-datetime';

interface TimeConverterFormProps {
  /**
   * Whether this form's tab is currently active
   */
  isActive: boolean;
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

export function TimeConverterForm({ isActive }: TimeConverterFormProps) {
  const [results, setResults] = React.useState<TimeConversionResult | null>(null);
  const [hasConverted, setHasConverted] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<TimeUnit>('unix-seconds');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(createFormSchema(selectedUnit)),
    defaultValues: {
      value: '',
      fromUnit: 'unix-seconds',
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

  // Handle unit change: clear results, clear input, focus input, update schema
  const handleUnitChange = (newUnit: string) => {
    const newUnitType = newUnit as TimeUnit;
    setSelectedUnit(newUnitType);
    form.setValue('fromUnit', newUnit);
    form.setValue('value', '');
    setResults(null);
    setHasConverted(false);
    form.clearErrors();

    // Update the form resolver with new schema
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(handleConvert)();
    }
  };

  // Get input type and placeholder based on selected unit
  const getInputConfig = () => {
    switch (selectedUnit) {
      case 'unix-seconds':
        return {
          type: 'text',
          placeholder: 'e.g., 1729354800',
          inputMode: 'numeric' as const,
        };
      case 'unix-milliseconds':
        return {
          type: 'text',
          placeholder: 'e.g., 1729354800000',
          inputMode: 'numeric' as const,
        };
      case 'local-datetime':
      case 'utc-datetime':
        return {
          type: 'datetime-local',
          placeholder: '',
          inputMode: 'none' as const,
        };
      default:
        return {
          type: 'text',
          placeholder: 'Enter value',
          inputMode: 'text' as const,
        };
    }
  };

  const inputConfig = getInputConfig();
  const selectedUnitInfo = timeUnits.find((u) => u.id === selectedUnit);

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleConvert)} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4'>
            {/* Unit Select */}
            <FormField
              control={form.control}
              name='fromUnit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Format</FormLabel>
                  <Select onValueChange={handleUnitChange} defaultValue={field.value}>
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
                  {/* {selectedUnitInfo && (
                    <p className='text-xs text-muted-foreground mt-1'>{selectedUnitInfo.description}</p>
                  )} */}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <p className='text-xs text-muted-foreground'>
            Press <kbd className='px-2 py-1 bg-muted rounded text-xs'>Enter</kbd> to convert
          </p>
        </form>
      </Form>

      {/* Results Display */}
      {hasConverted && results && (
        <div className='border-t border-border pt-6'>
          <h3 className='text-lg font-semibold text-foreground mb-4'>Conversion Results</h3>
          <Card>
            <CardContent className='p-4'>
              <div className='space-y-3'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <span className='text-xs sm:text-sm font-medium text-muted-foreground min-w-[200px]'>
                    Unix Epoch (Seconds)
                  </span>
                  <span className='font-mono text-xs sm:text-sm text-foreground break-all'>{results.unixSeconds}</span>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <span className='text-xs sm:text-sm font-medium text-muted-foreground min-w-[200px]'>
                    Unix Epoch (Milliseconds)
                  </span>
                  <span className='font-mono text-xs sm:text-sm text-foreground break-all'>
                    {results.unixMilliseconds}
                  </span>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <span className='text-xs sm:text-sm font-medium text-muted-foreground min-w-[200px]'>
                    Local Datetime
                  </span>
                  <span className='font-mono text-xs sm:text-sm text-foreground break-all'>
                    {formatLocalDatetimeDisplay(results.localDatetime, results.timezone, results.isDST)}
                  </span>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
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
