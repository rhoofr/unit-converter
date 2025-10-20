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
  ConversionResultsList,
} from '@/components/ui';
import type { ConversionResult as ConversionResultType } from '@/components/ui';

interface UnitConverterFormProps {
  defaultUnit: string;
  availableUnits: string[];
  /**
   * Function to convert a value from one unit to all other units in the category
   * @param value - The numeric value to convert
   * @param unitId - The ID of the source unit
   * @returns Array of conversion results
   */
  convertFunction: (value: number, unitId: string) => ConversionResultType[];
  /**
   * Function to get the unit ID from the unit name
   * @param unitName - The display name of the unit
   * @returns The unit ID or undefined if not found
   */
  getUnitIdFunction: (unitName: string) => string | undefined;
  /**
   * Whether this form's tab is currently active
   */
  isActive: boolean;
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

export function UnitConverterForm({
  defaultUnit,
  availableUnits,
  convertFunction,
  getUnitIdFunction,
  isActive,
}: UnitConverterFormProps) {
  const [results, setResults] = React.useState<ConversionResultType[]>([]);
  const [hasConverted, setHasConverted] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
      fromUnit: defaultUnit,
    },
    mode: 'onChange', // Enable real-time validation
  });

  const handleConvert = (data: FormData) => {
    const numericValue = parseFloat(data.value);
    const unitId = getUnitIdFunction(data.fromUnit);

    if (unitId) {
      const conversionResults = convertFunction(numericValue, unitId);
      setResults(conversionResults);
      setHasConverted(true);
    }
  };

  // Update form when defaultUnit changes (e.g., user preferences change)
  React.useEffect(() => {
    form.reset({
      value: '',
      fromUnit: defaultUnit,
    });
    setResults([]);
    setHasConverted(false);
  }, [defaultUnit, form]);

  // Auto-focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Focus input when tab becomes active
  React.useEffect(() => {
    if (isActive) {
      // Use requestAnimationFrame to ensure the tab content is fully visible
      // before attempting to focus the input
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isActive]);

  // Auto-convert when value or unit changes (with debounce)
  React.useEffect(() => {
    const subscription = form.watch((formData) => {
      // Only auto-convert if both value and unit are present and valid
      if (formData.value && formData.fromUnit) {
        const numericValue = parseFloat(formData.value);
        if (!isNaN(numericValue) && isFinite(numericValue)) {
          const unitId = getUnitIdFunction(formData.fromUnit);
          if (unitId) {
            const conversionResults = convertFunction(numericValue, unitId);
            setResults(conversionResults);
            setHasConverted(true);
          }
        }
      } else {
        // Clear results if input is cleared
        setResults([]);
        setHasConverted(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, convertFunction, getUnitIdFunction]);

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
                      inputMode='decimal'
                      placeholder='Enter value'
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

            {/* Unit Select */}
            <FormField
              control={form.control}
              name='fromUnit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Unit</FormLabel>
                  <Select onValueChange={handleUnitChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-base sm:text-lg'>
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

          <p className='hidden sm:block text-xs text-muted-foreground'>
            Press <kbd className='px-2 py-1 bg-muted rounded text-xs'>Enter</kbd> to convert
          </p>
        </form>
      </Form>

      {/* Results Display */}
      {hasConverted && <ConversionResultsList results={results} />}
    </div>
  );
}
