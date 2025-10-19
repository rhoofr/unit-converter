'use client';

import * as React from 'react';
import { Ruler, Droplet, Weight, Thermometer, Clock } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { UnitConverterForm } from '@/components/unit-converter-form';
import { TimeConverterResults } from '@/components/time-converter-results';
import { convertLength, getUnitIdFromName as getLengthUnitId } from '@/lib/conversions/length';
import { convertVolume, getUnitIdFromName as getVolumeUnitId } from '@/lib/conversions/volume';
import { convertWeight, getUnitIdFromName as getWeightUnitId } from '@/lib/conversions/weight';
import { convertTemperature, getUnitIdFromName as getTemperatureUnitId } from '@/lib/conversions/temperature';

interface ConversionCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  units: string[];
  defaultUnit: string;
}

const categories: ConversionCategory[] = [
  {
    id: 'length',
    name: 'Length',
    description: 'Convert between metric and imperial distance measurements',
    icon: Ruler,
    units: ['Kilometers', 'Miles', 'Millimeters', 'Centimeters', 'Meters', 'Inches', 'Feet', 'Yards'],
    defaultUnit: 'Kilometers',
  },
  {
    id: 'volume',
    name: 'Volume',
    description: 'Convert between metric and US liquid measurements',
    icon: Droplet,
    units: ['Milliliters', 'Liters', 'Fluid Ounces', 'Cups', 'Pints', 'Quarts', 'Gallons'],
    defaultUnit: 'Liters',
  },
  {
    id: 'weight',
    name: 'Weight',
    description: 'Convert between metric and imperial mass measurements',
    icon: Weight,
    units: ['Grams', 'Kilograms', 'Metric Tons', 'Ounces', 'Pounds', 'US Tons', 'Stone'],
    defaultUnit: 'Ounces',
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
  const [activeTab, setActiveTab] = React.useState('length');

  return (
    <Tabs defaultValue='length' className='w-full' onValueChange={setActiveTab}>
      <TabsList className='grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 h-auto p-0 bg-muted'>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className='text-sm sm:text-base flex items-center gap-2 px-3 py-2 data-[state=active]:bg-background'>
              <Icon className='h-4 w-4' />
              <span className='hidden sm:inline'>{category.name}</span>
              <span className='sm:hidden'>{category.name}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {categories.map((category) => {
        const Icon = category.icon;

        // Determine which conversion functions to use based on category
        const getConversionProps = () => {
          switch (category.id) {
            case 'length':
              return {
                convertFunction: convertLength,
                getUnitIdFunction: getLengthUnitId,
              };
            case 'volume':
              return {
                convertFunction: convertVolume,
                getUnitIdFunction: getVolumeUnitId,
              };
            case 'weight':
              return {
                convertFunction: convertWeight,
                getUnitIdFunction: getWeightUnitId,
              };
            case 'temperature':
              return {
                convertFunction: convertTemperature,
                getUnitIdFunction: getTemperatureUnitId,
              };
            default:
              return null;
          }
        };

        const conversionProps = getConversionProps();

        return (
          <TabsContent key={category.id} value={category.id} className='mt-2'>
            <Card>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-primary/10'>
                    <Icon className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <CardTitle className='text-xl sm:text-2xl'>{category.name} Converter</CardTitle>
                    <CardDescription className='text-xs sm:text-sm mt-1'>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='pt-4 border-t border-border'>
                    {category.id === 'time' ? (
                      <TimeConverterResults />
                    ) : conversionProps ? (
                      <UnitConverterForm
                        defaultUnit={category.defaultUnit}
                        availableUnits={category.units}
                        convertFunction={conversionProps.convertFunction}
                        getUnitIdFunction={conversionProps.getUnitIdFunction}
                        isActive={activeTab === category.id}
                      />
                    ) : (
                      <>
                        <p className='text-sm text-muted-foreground mb-4'>
                          Enter a value in any unit and convert to all other units in this category. Results are precise
                          and formatted smartly.
                        </p>
                        <div className='bg-muted/50 rounded-lg p-6 text-center'>
                          <p className='text-muted-foreground'>Conversion form will appear here</p>
                          <p className='text-xs text-muted-foreground mt-2'>Coming in the next iteration</p>
                        </div>
                      </>
                    )}
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
