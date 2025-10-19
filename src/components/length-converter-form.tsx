'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { convertLength, getUnitIdFromName } from '@/lib/conversions/length';
import type { ConversionResult } from '@/lib/conversions/length';

interface LengthConverterFormProps {
  defaultUnit: string;
  availableUnits: string[];
}

// Zod schema for form validation
const formSchema = z.object({
  value: z
    .string()
    .min(1, 'Please enter a value')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && isFinite(num);
    }, 'Please enter a valid number'),
  fromUnit: z.string().min(1, 'Please select a unit'),
});

type FormData = z.infer<typeof formSchema>;

export function LengthConverterForm({ defaultUnit, availableUnits }: LengthConverterFormProps) {
  const [results, setResults] = React.useState<ConversionResult[]>([]);
  const [hasConverted, setHasConverted] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
      fromUnit: defaultUnit,
    },
  });

  const handleConvert = (data: FormData) => {
    const numericValue = parseFloat(data.value);
    const unitId = getUnitIdFromName(data.fromUnit);

    if (unitId) {
      const conversionResults = convertLength(numericValue, unitId);
      setResults(conversionResults);
      setHasConverted(true);
    }
  };

  // Auto-focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle unit change: clear results, clear input, focus input
  const handleUnitChange = (newUnit: string) => {
    form.setValue('fromUnit', newUnit);
    form.setValue('value', '');
    setResults([]);
    setHasConverted(false);
    // Focus the input field after state updates
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

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleConvert)} className='space-y-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Value Input */}
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter value'
                      {...field}
                      ref={inputRef}
                      onKeyDown={handleKeyDown}
                      className='text-lg'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit Select */}
            <FormField
              control={form.control}
              name='fromUnit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Unit</FormLabel>
                  <Select onValueChange={handleUnitChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-lg'>
                        <SelectValue placeholder='Select unit' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
      {hasConverted && results.length > 0 && (
        <div className='border-t border-border pt-6'>
          <h3 className='text-lg font-semibold text-foreground mb-4'>Conversion Results</h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
            {results.map((result) => (
              <div
                key={result.unitId}
                className='bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>{result.unitName}</span>
                  <span className='text-xs text-muted-foreground'>({result.symbol})</span>
                </div>
                <p className='text-xl font-bold text-foreground mt-2 break-words'>{result.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasConverted && results.length === 0 && (
        <div className='text-center text-muted-foreground py-8'>
          <p>No conversion results available.</p>
        </div>
      )}
    </div>
  );
}
