'use client';

import { useUnitPreferencesContext } from '@/contexts/unit-preferences-context';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';
import { Calendar, CalendarDays, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface DateConverterFormProps {
  isActive: boolean;
}

const formSchema = z.object({
  mode: z.enum(['date', 'days']),
  fromDate: z.date(),
  toDate: z.date().optional(),
  days: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type DatePickerInputProps = {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
};

const DatePickerInput = React.forwardRef<HTMLInputElement, DatePickerInputProps>(
  ({ value, onClick, placeholder }, ref) => (
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
        tabIndex={-1}
        className='absolute right-0 top-0 h-10 px-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors'>
        <Calendar className='h-4 w-4' />
      </button>
    </div>
  )
);
DatePickerInput.displayName = 'DatePickerInput';

// Get user preferences context

export function DateConverterForm({ isActive }: DateConverterFormProps) {
  const { getDefaultUnit } = useUnitPreferencesContext();

  const today = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  // Get user preference for date mode
  const preferredDateMode = React.useMemo(() => {
    const pref = getDefaultUnit ? getDefaultUnit('date') : 'Pick end date';
    return pref === 'Add days' ? 'days' : 'date';
  }, [getDefaultUnit]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: preferredDateMode,
      fromDate: today,
      toDate: today,
      days: '',
    },
    mode: 'onChange',
  });

  const [result, setResult] = React.useState<{
    daysDiff: number | null;
    endDate: Date | null;
  }>({
    daysDiff: null,
    endDate: null,
  });
  const fromDateButtonRef = React.useRef<HTMLButtonElement>(null);
  const toDateButtonRef = React.useRef<HTMLButtonElement>(null);
  const toDateInputRef = React.useRef<HTMLInputElement>(null);
  const daysInputRef = React.useRef<HTMLInputElement>(null);

  // Watch form values
  const mode = form.watch('mode');
  const fromDate = form.watch('fromDate');
  const toDate = form.watch('toDate');
  const days = form.watch('days');

  React.useEffect(() => {
    if (!fromDate || !(fromDate instanceof Date) || isNaN(fromDate.getTime())) {
      setResult({ daysDiff: null, endDate: null });
      return;
    }
    if (mode === 'date') {
      if (toDate && toDate instanceof Date && !isNaN(toDate.getTime())) {
        const diff = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
        setResult({ daysDiff: diff, endDate: null });
      } else {
        setResult({ daysDiff: null, endDate: null });
      }
    } else if (mode === 'days') {
      const n = Number(days);
      if (!isNaN(n)) {
        const end = new Date(fromDate);
        end.setDate(end.getDate() + n);
        setResult({ daysDiff: n, endDate: end });
      } else {
        setResult({ daysDiff: null, endDate: null });
      }
    }
  }, [mode, fromDate, toDate, days]);

  // When tab becomes active, set mode to user preference and focus
  React.useEffect(() => {
    if (isActive) {
      form.setValue('mode', preferredDateMode);
      requestAnimationFrame(() => {
        fromDateButtonRef.current?.focus();
      });
    }
  }, [isActive, preferredDateMode, form]);

  // Quick set to today
  const setFromToday = () => form.setValue('fromDate', today);
  const setToToday = () => form.setValue('toDate', today);

  // Format date as yyyy-MM-dd
  const formatDate = (date: Date) =>
    date
      ? date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      : '';

  React.useEffect(() => {
    if (mode === 'date') {
      form.setValue('days', ''); // Reset days input
      form.setValue('toDate', today); // Explicitly set toDate to today
      requestAnimationFrame(() => {
        toDateInputRef.current?.focus();
      });
    } else if (mode === 'days') {
      form.setValue('toDate', today); // Reset toDate input to today instead of undefined
      requestAnimationFrame(() => {
        daysInputRef.current?.focus();
      });
    }
  }, [mode, form, today]);

  return (
    <Card className='w-full py-4'>
      <CardHeader>
        <CardTitle>Date Calculator</CardTitle>
        <CardDescription>
          Calculate the number of days between two dates, or add/subtract days to a date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-4'>
            {/* Mode Toggle */}
            <FormField
              control={form.control}
              name='mode'
              render={({ field }) => (
                <FormItem>
                  <div className='flex gap-2 items-center mb-2'>
                    <FormLabel className='sr-only'>Mode</FormLabel>
                    <Button
                      type='button'
                      variant={field.value === 'date' ? 'default' : 'secondary'}
                      size='sm'
                      className={cn(
                        'flex-1 flex gap-2 items-center rounded-full',
                        field.value === 'date' && 'ring-2 ring-primary'
                      )}
                      onClick={() => field.onChange('date')}
                      aria-pressed={field.value === 'date'}>
                      <CalendarDays className='h-4 w-4' /> Pick end date
                    </Button>
                    <Button
                      type='button'
                      variant={field.value === 'days' ? 'default' : 'secondary'}
                      size='sm'
                      className={cn(
                        'flex-1 flex gap-2 items-center rounded-full',
                        field.value === 'days' && 'ring-2 ring-primary'
                      )}
                      onClick={() => field.onChange('days')}
                      aria-pressed={field.value === 'days'}>
                      <PlusCircle className='h-4 w-4' /> Add days
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
              {/* From Date */}
              <FormField
                control={form.control}
                name='fromDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Date</FormLabel>
                    <div className='flex gap-2 items-center'>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat='MM/dd/yyyy'
                          placeholderText='Select date'
                          className={cn(
                            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                          )}
                          todayButton='Today'
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode='select'
                          customInput={<DatePickerInput />}
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='secondary'
                        size='sm'
                        onClick={setFromToday}
                        ref={fromDateButtonRef}>
                        Today
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* To Date or Days */}
              {mode === 'date' ? (
                <FormField
                  control={form.control}
                  name='toDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Date</FormLabel>
                      <div className='flex gap-2 items-center'>
                        <FormControl>
                          <DatePicker
                            selected={
                              field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value : today
                            }
                            onChange={(date) => field.onChange(date)}
                            dateFormat='MM/dd/yyyy'
                            placeholderText='Select date'
                            className={cn(
                              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                            )}
                            todayButton='Today'
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode='select'
                            customInput={<DatePickerInput ref={toDateInputRef} placeholder='Select a date' />}
                          />
                        </FormControl>
                        <Button type='button' variant='secondary' size='sm' onClick={setToToday} ref={toDateButtonRef}>
                          Today
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name='days'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Days</FormLabel>
                      <FormControl>
                        <input
                          type='number'
                          {...field}
                          ref={daysInputRef}
                          className={cn(
                            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-lg ring-offset-background',
                            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                          )}
                          placeholder='Enter days'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
        {/* Results Display */}
        <div className='mt-6 border-t border-border pt-4'>
          {mode === 'date' && result.daysDiff !== null && (
            <div className='text-lg sm:text-xl font-semibold text-center'>
              {result.daysDiff === 0
                ? 'Same day'
                : `${result.daysDiff > 0 ? '+' : ''}${result.daysDiff} day${
                    Math.abs(result.daysDiff) === 1 ? '' : 's'
                  }`}
            </div>
          )}
          {mode === 'days' && result.endDate && typeof result.daysDiff === 'number' && (
            <div className='text-lg sm:text-xl font-semibold text-center'>
              {`${formatDate(result.endDate)}   `}
              <span className='text-sm text-muted-foreground mt-1'>
                {result.daysDiff === 0
                  ? 'Same day'
                  : `${result.daysDiff > 0 ? '+' : ''}${result.daysDiff} day${
                      Math.abs(result.daysDiff) === 1 ? '' : 's'
                    } from start`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
