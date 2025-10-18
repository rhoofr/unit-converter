'use client';

import * as React from 'react';
import { Ruler, Droplet, Weight, Thermometer, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ConversionCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  units: string[];
}

const categories: ConversionCategory[] = [
  {
    id: 'length',
    name: 'Length',
    description: 'Convert between metric and imperial distance measurements',
    icon: Ruler,
    units: ['Millimeter', 'Centimeter', 'Meter', 'Kilometer', 'Inch', 'Foot', 'Yard', 'Mile'],
    defaultUnit: 'Kilometer',
  },
  {
    id: 'volume',
    name: 'Volume',
    description: 'Convert between metric and US liquid measurements',
    icon: Droplet,
    units: ['Milliliter', 'Liter', 'Fluid Ounce', 'Cup', 'Pint', 'Quart', 'Gallon'],
    defaultUnit: 'Liter',
  },
  {
    id: 'weight',
    name: 'Weight',
    description: 'Convert between metric and imperial mass measurements',
    icon: Weight,
    units: ['Gram', 'Kilogram', 'Metric Ton', 'Ounce', 'Pound', 'US Ton', 'Stone'],
    defaultUnit: 'Ounce',
  },
  {
    id: 'temperature',
    name: 'Temperature',
    description: 'Convert between common temperature scales',
    icon: Thermometer,
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    defaultUnit: 'Celsius',
  },
  {
    id: 'time',
    name: 'Time',
    description: 'Convert between Unix epoch and datetime formats',
    icon: Clock,
    units: ['Unix Epoch (Seconds)', 'Unix Epoch (Milliseconds)', 'Local Datetime', 'UTC Datetime'],
    defaultUnit: 'Unix Epoch (Seconds)',
  },
];

export function CategoryTabs() {
  return (
    <Tabs defaultValue='length' className='w-full'>
      <TabsList className='grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 h-auto p-1 bg-muted'>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className='flex items-center gap-2 px-3 py-2 data-[state=active]:bg-background'>
              <Icon className='h-4 w-4' />
              <span className='hidden sm:inline'>{category.name}</span>
              <span className='sm:hidden'>{category.name}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <TabsContent key={category.id} value={category.id} className='mt-6'>
            <Card>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-primary/10'>
                    <Icon className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <CardTitle className='text-2xl'>{category.name} Converter</CardTitle>
                    <CardDescription className='mt-1'>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium text-foreground mb-3'>Available Units:</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                      {category.units.map((unit) => (
                        <div
                          key={unit}
                          className='px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm text-center'>
                          {unit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='pt-4 border-t border-border'>
                    <p className='text-sm text-muted-foreground mb-4'>
                      Enter a value in any unit and convert to all other units in this category. Results are precise to
                      4 decimal places.
                    </p>
                    <div className='bg-muted/50 rounded-lg p-6 text-center'>
                      <p className='text-muted-foreground'>Conversion form will appear here</p>
                      <p className='text-xs text-muted-foreground mt-2'>Coming in the next iteration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
