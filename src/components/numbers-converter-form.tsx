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
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { useUnitPreferencesContext } from '@/contexts/unit-preferences-context';

interface NumbersConverterFormProps {
  isActive: boolean;
}

const compareSchema = z.object({
  first: z
    .string()
    .min(1, 'Enter first number')
    .refine((val) => !isNaN(Number(val)), 'Must be a number'),
  second: z
    .string()
    .min(1, 'Enter second number')
    .refine((val) => !isNaN(Number(val)), 'Must be a number'),
});

type CompareFormData = z.infer<typeof compareSchema>;

const percentSchema = z.object({
  base: z
    .string()
    .min(1, 'Enter a number')
    .refine((val) => !isNaN(Number(val)), 'Must be a number'),
  percent: z
    .string()
    .min(1, 'Enter a percentage')
    .refine((val) => !isNaN(Number(val)), 'Must be a number'),
});

type PercentFormData = z.infer<typeof percentSchema>;

export function NumbersConverterForm({ isActive }: NumbersConverterFormProps) {
  const { getDefaultUnit } = useUnitPreferencesContext();
  const defaultOption = React.useMemo(() => {
    const pref = getDefaultUnit ? getDefaultUnit('numbers') : 'Compare two numbers';
    return pref === 'Number up/down by %' ? 'percent' : 'compare';
  }, [getDefaultUnit]);
  const [option, setOption] = React.useState<'compare' | 'percent'>(defaultOption);
  // Compare state
  const [compareResult, setCompareResult] = React.useState<{ diff: number; percent: number } | null>(null);
  // Percent state
  const [percentResult, setPercentResult] = React.useState<number | null>(null);

  // Input refs for auto-focus
  const compareFirstInputRef = React.useRef<HTMLInputElement>(null);
  const percentBaseInputRef = React.useRef<HTMLInputElement>(null);

  // Compare form
  const compareForm = useForm<CompareFormData>({
    resolver: zodResolver(compareSchema),
    defaultValues: { first: '', second: '' },
    mode: 'onChange',
  });

  // Percent form
  const percentForm = useForm<PercentFormData>({
    resolver: zodResolver(percentSchema),
    defaultValues: { base: '', percent: '' },
    mode: 'onChange',
  });

  // Compare calculation
  const handleCompare = (data: CompareFormData) => {
    const first = parseFloat(data.first);
    const second = parseFloat(data.second);
    const diff = second - first;
    const percent = first !== 0 ? (diff / first) * 100 : 0;
    setCompareResult({ diff, percent });
  };

  // Percent calculation
  const handlePercent = (data: PercentFormData) => {
    const base = parseFloat(data.base);
    const percent = parseFloat(data.percent);
    const result = base * (1 + percent / 100);
    setPercentResult(result);
  };

  // Reset results on option switch or tab activation
  React.useEffect(() => {
    setCompareResult(null);
    setPercentResult(null);
    compareForm.reset();
    percentForm.reset();
  }, [option, isActive, compareForm, percentForm]);

  // Auto-focus first input on mount, tab activation, or option change
  React.useEffect(() => {
    if (!isActive) return;
    // Use requestAnimationFrame to ensure input is visible
    requestAnimationFrame(() => {
      if (option === 'compare') {
        compareFirstInputRef.current?.focus();
      } else {
        percentBaseInputRef.current?.focus();
      }
    });
  }, [option, isActive]);

  // When tab becomes active, set option to user preference
  React.useEffect(() => {
    if (isActive) {
      setOption(defaultOption);
    }
  }, [isActive, defaultOption]);

  return (
    <Card className='w-full py-4'>
      <CardHeader>
        <CardTitle>Numbers Calculator</CardTitle>
        <CardDescription>Compare two numbers or calculate a number up/down by a percentage.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col sm:flex-row gap-2 mb-6'>
          <Button
            type='button'
            variant={option === 'compare' ? 'default' : 'outline'}
            className={cn('flex-1', option === 'compare' && 'ring-2 ring-primary')}
            onClick={() => setOption('compare')}
            aria-pressed={option === 'compare'}>
            Compare Two Numbers
          </Button>
          <Button
            type='button'
            variant={option === 'percent' ? 'default' : 'outline'}
            className={cn('flex-1', option === 'percent' && 'ring-2 ring-primary')}
            onClick={() => setOption('percent')}
            aria-pressed={option === 'percent'}>
            Number Up/Down by %
          </Button>
        </div>
        {option === 'compare' && (
          <Form {...compareForm}>
            <form onSubmit={compareForm.handleSubmit(handleCompare)} className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                  control={compareForm.control}
                  name='first'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Number</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          inputMode='decimal'
                          placeholder='e.g. 200'
                          {...field}
                          ref={compareFirstInputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={compareForm.control}
                  name='second'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Second Number</FormLabel>
                      <FormControl>
                        <Input type='text' inputMode='decimal' placeholder='e.g. 205' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type='submit' className='w-full sm:w-auto'>
                Compare
              </Button>
            </form>
          </Form>
        )}
        {option === 'compare' && compareResult && (
          <div className='mt-6 bg-muted/50 rounded-lg p-4 flex flex-col gap-2'>
            <div>
              <span className='font-medium'>Difference:</span> {compareResult.diff.toFixed(2)}
            </div>
            <div>
              <span className='font-medium'>% Difference:</span> {compareResult.percent.toFixed(2)}%
            </div>
          </div>
        )}
        {option === 'percent' && (
          <Form {...percentForm}>
            <form onSubmit={percentForm.handleSubmit(handlePercent)} className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                  control={percentForm.control}
                  name='base'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number</FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          inputMode='decimal'
                          placeholder='e.g. 200'
                          {...field}
                          ref={percentBaseInputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={percentForm.control}
                  name='percent'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type='text' inputMode='decimal' placeholder='e.g. 3 or -4' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type='submit' className='w-full sm:w-auto'>
                Calculate
              </Button>
            </form>
          </Form>
        )}
        {option === 'percent' && percentResult !== null && (
          <div className='mt-6 bg-muted/50 rounded-lg p-4'>
            <span className='font-medium'>Result:</span> {percentResult.toFixed(2)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
