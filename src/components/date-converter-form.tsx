'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui';
import { Calendar } from 'lucide-react';

interface DateConverterFormProps {
  isActive: boolean;
}

const formSchema = z.object({
  fromDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), {
    message: 'Please select a valid start date',
  }),
  toDate: z.date().refine((d) => d instanceof Date && !isNaN(d.getTime()), {
    message: 'Please select a valid end date',
  }),
});

type FormData = z.infer<typeof formSchema>;

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
      tabIndex={-1}
      className='absolute right-0 top-0 h-10 px-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors'>
      <Calendar className='h-4 w-4' />
    </button>
  </div>
));

DatePickerInput.displayName = 'DatePickerInput';

export function DateConverterForm({ isActive }: DateConverterFormProps) {
  const today = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromDate: today,
      toDate: today,
    },
    mode: 'onChange',
  });

  const [daysDiff, setDaysDiff] = React.useState<number | null>(null);
  // For focusing, use a button ref instead of DatePicker ref (react-datepicker doesn't expose input ref directly)
  const fromDateButtonRef = React.useRef<HTMLButtonElement>(null);

  // Calculate days difference whenever dates change
  const fromDate = form.watch('fromDate');
  const toDate = form.watch('toDate');
  React.useEffect(() => {
    if (fromDate && toDate) {
      const diff = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
      setDaysDiff(diff);
    } else {
      setDaysDiff(null);
    }
  }, [fromDate, toDate]);

  // Focus "From" date button when tab becomes active
  React.useEffect(() => {
    if (isActive) {
      requestAnimationFrame(() => {
        fromDateButtonRef.current?.focus();
      });
    }
  }, [isActive]);

  // Quick set to today
  const setFromToday = () => form.setValue('fromDate', today);
  const setToToday = () => form.setValue('toDate', today);

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Date Difference Calculator</CardTitle>
        <CardDescription>Calculate the number of days between two dates.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* From Date */}
              <FormField
                control={form.control}
                name='fromDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <div className='flex gap-2 items-center'>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat='yyyy-MM-dd'
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
              {/* To Date */}
              <FormField
                control={form.control}
                name='toDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <div className='flex gap-2 items-center'>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat='yyyy-MM-dd'
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
                      <Button type='button' variant='secondary' size='sm' onClick={setToToday}>
                        Today
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        {/* Results Display */}
        <div className='mt-6 border-t border-border pt-6'>
          {daysDiff !== null && (
            <div className='text-lg sm:text-xl font-semibold text-center'>
              {daysDiff === 0
                ? 'Same day'
                : `${daysDiff > 0 ? '+' : ''}${daysDiff} day${Math.abs(daysDiff) === 1 ? '' : 's'}`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
