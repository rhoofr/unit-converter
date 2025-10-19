/**
 * Volume Conversion Utilities
 * Base unit: Liter (L)
 */

import type { ConversionResult } from './conversion-utils';
import { formatNumber } from './conversion-utils';

export interface VolumeUnit {
  id: string;
  name: string;
  symbol: string;
  toBase: (value: number) => number; // Convert to liters
  fromBase: (value: number) => number; // Convert from liters
}

export const volumeUnits: Record<string, VolumeUnit> = {
  milliliter: {
    id: 'milliliter',
    name: 'Milliliters',
    symbol: 'mL',
    toBase: (value: number) => value / 1000,
    fromBase: (value: number) => value * 1000,
  },
  liter: {
    id: 'liter',
    name: 'Liters',
    symbol: 'L',
    toBase: (value: number) => value,
    fromBase: (value: number) => value,
  },
  fluidOunce: {
    id: 'fluidOunce',
    name: 'Fluid Ounces',
    symbol: 'fl oz',
    toBase: (value: number) => value * 0.0295735,
    fromBase: (value: number) => value / 0.0295735,
  },
  cup: {
    id: 'cup',
    name: 'Cups',
    symbol: 'cup',
    toBase: (value: number) => value * 0.236588,
    fromBase: (value: number) => value / 0.236588,
  },
  pint: {
    id: 'pint',
    name: 'Pints',
    symbol: 'pt',
    toBase: (value: number) => value * 0.473176,
    fromBase: (value: number) => value / 0.473176,
  },
  quart: {
    id: 'quart',
    name: 'Quarts',
    symbol: 'qt',
    toBase: (value: number) => value * 0.946353,
    fromBase: (value: number) => value / 0.946353,
  },
  gallon: {
    id: 'gallon',
    name: 'Gallons',
    symbol: 'gal',
    toBase: (value: number) => value * 3.78541,
    fromBase: (value: number) => value / 3.78541,
  },
};

/**
 * Convert a volume value from one unit to all other units
 * @param value - The numeric value to convert
 * @param fromUnitId - The ID of the source unit (e.g., 'liter', 'gallon')
 * @returns Array of conversion results for all units
 */
export function convertVolume(value: number, fromUnitId: string): ConversionResult[] {
  const fromUnit = volumeUnits[fromUnitId];

  if (!fromUnit) {
    throw new Error(`Invalid unit ID: ${fromUnitId}`);
  }

  // Convert input value to base unit (liters)
  const baseValue = fromUnit.toBase(value);

  // Convert base value to all other units
  const results: ConversionResult[] = Object.values(volumeUnits)
    .filter((unit) => unit.id !== fromUnitId) // Exclude the source unit
    .map((unit) => ({
      unitId: unit.id,
      unitName: unit.name,
      symbol: unit.symbol,
      value: formatNumber(unit.fromBase(baseValue)),
    }));

  return results;
}

/**
 * Get an array of all volume unit names for the select dropdown
 */
export function getVolumeUnitNames(): string[] {
  return Object.values(volumeUnits).map((unit) => unit.name);
}

/**
 * Get unit ID from unit name (case-insensitive)
 * @param name - The display name of the unit (e.g., 'Liter')
 * @returns The unit ID (e.g., 'liter')
 */
export function getUnitIdFromName(name: string): string | undefined {
  const unit = Object.values(volumeUnits).find((u) => u.name.toLowerCase() === name.toLowerCase());
  return unit?.id;
}
