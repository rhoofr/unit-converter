'use client';

import * as React from 'react';
import { Ruler, Droplet, Weight, Thermometer, Clock, Calendar } from 'lucide-react';
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
import { TimeConverterForm } from '@/components/time-converter-form';
import { DateConverterForm } from '@/components/date-converter-form';
import { TimeConverterResults } from '@/components/time-converter-results';
import { convertLength, getUnitIdFromName as getLengthUnitId } from '@/lib/conversions/length';
import { convertVolume, getUnitIdFromName as getVolumeUnitId } from '@/lib/conversions/volume';
import { convertWeight, getUnitIdFromName as getWeightUnitId } from '@/lib/conversions/weight';
import { convertTemperature, getUnitIdFromName as getTemperatureUnitId } from '@/lib/conversions/temperature';
import { useUnitPreferencesContext } from '@/contexts/unit-preferences-context';

type CategoryId = 'length' | 'volume' | 'weight' | 'temperature' | 'time' | 'date';

interface ConversionCategory {
  id: CategoryId;
  name: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  units: string[];
}

const categories: ConversionCategory[] = [
  {
    id: 'length',
    name: 'Length',
    description: 'Convert between metric and imperial distance measurements',
    action: 'Converter',
    icon: Ruler,

    units: [
      'Kilometers',
      'Miles',
      'Millimeters',
      'Centimeters',
      'Meters',
      'Inches',
      'Feet',
      'Yards',
      'Steps (Walking)',
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    description: 'Convert between metric and US liquid measurements',
    action: 'Converter',
    icon: Droplet,
    units: ['Milliliters', 'Liters', 'Fluid Ounces', 'Cups', 'Pints', 'Quarts', 'Gallons'],
  },
  {
    id: 'weight',
    name: 'Weight',
    description: 'Convert between metric and imperial mass measurements',
    action: 'Converter',
    icon: Weight,
    units: ['Grams', 'Kilograms', 'Metric Tons', 'Ounces', 'Pounds', 'US Tons', 'Stone'],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    description: 'Convert between common temperature scales',
    action: 'Converter',
    icon: Thermometer,
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
  },
  {
    id: 'time',
    name: 'Time',
    description: 'Convert between Unix epoch and datetime formats',
    action: 'Converter',
    icon: Clock,
    units: ['Unix Epoch (Seconds)', 'Unix Epoch (Milliseconds)', 'Local Datetime', 'UTC Datetime'],
  },
  {
    id: 'date',
    name: 'Date',
    description: 'Calculate the difference in days between two dates',
    action: 'Calculator',
    icon: Calendar,
    units: ['From Date', 'To Date'],
  },
];

export function CategoryTabs() {
  const [activeTab, setActiveTab] = React.useState('length');
  const { getDefaultUnit, isLoaded } = useUnitPreferencesContext();

  // Don't render forms until preferences are loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className='w-full'>
        <div className='grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-0 bg-muted rounded-md'>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className='text-sm sm:text-base flex items-center justify-center gap-2 px-3 py-2 rounded-sm bg-background/50'>
                <Icon className='h-4 w-4' />
                <span>{category.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue='length' className='w-full' onValueChange={setActiveTab}>
      {/* Add wrapper with relative positioning and proper spacing */}
      <div className='space-y-4'>
        <TabsList className='grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-1 bg-muted'>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className='text-xs sm:text-sm lg:text-base flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 data-[state=active]:bg-background'>
                <Icon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span>{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Content area with explicit relative positioning */}
        <div className='relative'>
          {categories.map((category) => {
            const Icon = category.icon;
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
              <TabsContent key={category.id} value={category.id} className='mt-0'>
                <Card className='py-4'>
                  <CardHeader>
                    <div className='flex items-center gap-2 sm:gap-3'>
                      <div className='p-1.5 sm:p-2 rounded-lg bg-primary/10'>
                        <Icon className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
                      </div>
                      <div>
                        <CardTitle className='text-lg sm:text-xl lg:text-2xl'>
                          {category.name} {category.action}
                        </CardTitle>
                        <CardDescription className='text-xs sm:text-sm mt-0.5 sm:mt-1'>
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* ...existing CardContent code... */}
                    <div className='space-y-4'>
                      <div className='pt-4 border-t border-border'>
                        {category.id === 'time' ? (
                          <div className='space-y-6'>
                            <TimeConverterForm
                              defaultUnit={getDefaultUnit(category.id)}
                              isActive={activeTab === category.id}
                            />
                            <div className='border-t border-border' />
                            <TimeConverterResults />
                          </div>
                        ) : category.id === 'date' ? (
                          <DateConverterForm isActive={activeTab === category.id} />
                        ) : conversionProps ? (
                          <UnitConverterForm
                            defaultUnit={getDefaultUnit(category.id)}
                            availableUnits={category.units}
                            convertFunction={conversionProps.convertFunction}
                            getUnitIdFunction={conversionProps.getUnitIdFunction}
                            isActive={activeTab === category.id}
                          />
                        ) : (
                          <>
                            <p className='text-sm text-muted-foreground mb-4'>
                              Enter a value in any unit and convert to all other units in this category. Results are
                              precise and formatted smartly.
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
        </div>
      </div>
    </Tabs>
  );
}
