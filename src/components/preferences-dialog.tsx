'use client';

import * as React from 'react';
import { Ruler, Droplet, Weight, Thermometer, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useUnitPreferencesContext } from '@/contexts/unit-preferences-context';
import type { CategoryId, UnitPreferences } from '@/hooks/use-unit-preferences';

interface PreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CategoryConfig {
  id: CategoryId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  units: string[];
}

const categories: CategoryConfig[] = [
  {
    id: 'length',
    name: 'Length',
    icon: Ruler,
    units: ['Kilometers', 'Miles', 'Millimeters', 'Centimeters', 'Meters', 'Inches', 'Feet', 'Yards'],
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: Droplet,
    units: ['Milliliters', 'Liters', 'Fluid Ounces', 'Cups', 'Pints', 'Quarts', 'Gallons'],
  },
  {
    id: 'weight',
    name: 'Weight',
    icon: Weight,
    units: ['Grams', 'Kilograms', 'Metric Tons', 'Ounces', 'Pounds', 'US Tons', 'Stone'],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
  },
  {
    id: 'time',
    name: 'Time',
    icon: Clock,
    units: ['Unix Epoch (Seconds)', 'Unix Epoch (Milliseconds)', 'Local Datetime', 'UTC Datetime'],
  },
];

export function PreferencesDialog({ open, onOpenChange }: PreferencesDialogProps) {
  const { preferences, updatePreferences, resetPreferences } = useUnitPreferencesContext();
  const [localPreferences, setLocalPreferences] = React.useState<UnitPreferences>(preferences);

  // Sync local state when dialog opens or preferences change
  React.useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences, open]);

  const handleSave = () => {
    updatePreferences(localPreferences);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalPreferences(preferences);
    onOpenChange(false);
  };

  const handleReset = () => {
    resetPreferences();
    onOpenChange(false);
  };

  const handleUnitChange = (categoryId: CategoryId, unit: string) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [categoryId]: unit,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle className='text-xl sm:text-2xl'>Unit Preferences</DialogTitle>
          <DialogDescription className='text-sm sm:text-base'>Choose your preferred default units.</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <div className='flex items-center gap-2 sm:w-32'>
                  <Icon className='h-4 w-4 text-primary' />
                  <Label htmlFor={`unit-${category.id}`} className='text-sm font-medium'>
                    {category.name}
                  </Label>
                </div>
                <Select
                  value={localPreferences[category.id]}
                  onValueChange={(value) => handleUnitChange(category.id, value)}>
                  <SelectTrigger id={`unit-${category.id}`} className='w-full sm:flex-1'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {category.units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        <DialogFooter className='flex-col sm:flex-row gap-2'>
          <Button variant='outline' onClick={handleReset} className='w-full sm:w-auto'>
            Reset to Defaults
          </Button>
          <div className='flex gap-2 w-full sm:w-auto'>
            <Button variant='outline' onClick={handleCancel} className='flex-1 sm:flex-none'>
              Cancel
            </Button>
            <Button onClick={handleSave} className='flex-1 sm:flex-none'>
              Save Preferences
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
