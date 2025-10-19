/**
 * Weight Conversion Utilities
 * Base unit: Kilogram (kg)
 */

import type { ConversionResult } from './conversion-utils';
import { formatNumber } from './conversion-utils';

export interface WeightUnit {
  id: string;
  name: string;
  symbol: string;
  toBase: (value: number) => number; // Convert to kilograms
  fromBase: (value: number) => number; // Convert from kilograms
}

export const weightUnits: Record<string, WeightUnit> = {
  gram: {
    id: 'gram',
    name: 'Grams',
    symbol: 'g',
    toBase: (value: number) => value / 1000,
    fromBase: (value: number) => value * 1000,
  },
  kilogram: {
    id: 'kilogram',
    name: 'Kilograms',
    symbol: 'kg',
    toBase: (value: number) => value,
    fromBase: (value: number) => value,
  },
  metricTon: {
    id: 'metricTon',
    name: 'Metric Tons',
    symbol: 't',
    toBase: (value: number) => value * 1000,
    fromBase: (value: number) => value / 1000,
  },
  ounce: {
    id: 'ounce',
    name: 'Ounces',
    symbol: 'oz',
    toBase: (value: number) => value * 0.0283495,
    fromBase: (value: number) => value / 0.0283495,
  },
  pound: {
    id: 'pound',
    name: 'Pounds',
    symbol: 'lb',
    toBase: (value: number) => value * 0.453592,
    fromBase: (value: number) => value / 0.453592,
  },
  usTon: {
    id: 'usTon',
    name: 'US Tons',
    symbol: 'ton',
    toBase: (value: number) => value * 907.185,
    fromBase: (value: number) => value / 907.185,
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    symbol: 'st',
    toBase: (value: number) => value * 6.35029,
    fromBase: (value: number) => value / 6.35029,
  },
};

/**
 * Convert a weight value from one unit to all other units
 * @param value - The numeric value to convert
 * @param fromUnitId - The ID of the source unit (e.g., 'kilogram', 'pound')
 * @returns Array of conversion results for all units
 */
export function convertWeight(value: number, fromUnitId: string): ConversionResult[] {
  const fromUnit = weightUnits[fromUnitId];

  if (!fromUnit) {
    throw new Error(`Invalid unit ID: ${fromUnitId}`);
  }

  // Convert input value to base unit (kilograms)
  const baseValue = fromUnit.toBase(value);

  // Convert base value to all other units
  const results: ConversionResult[] = Object.values(weightUnits)
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
 * Get an array of all weight unit names for the select dropdown
 */
export function getWeightUnitNames(): string[] {
  return Object.values(weightUnits).map((unit) => unit.name);
}

/**
 * Get unit ID from unit name (case-insensitive)
 * @param name - The display name of the unit (e.g., 'Kilogram')
 * @returns The unit ID (e.g., 'kilogram')
 */
export function getUnitIdFromName(name: string): string | undefined {
  const unit = Object.values(weightUnits).find((u) => u.name.toLowerCase() === name.toLowerCase());
  return unit?.id;
}
