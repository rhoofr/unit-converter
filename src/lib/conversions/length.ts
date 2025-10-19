/**
 * Length Conversion Utilities
 * Base unit: Meter (m)
 */

export interface LengthUnit {
  id: string;
  name: string;
  symbol: string;
  toBase: (value: number) => number; // Convert to meters
  fromBase: (value: number) => number; // Convert from meters
}

export const lengthUnits: Record<string, LengthUnit> = {
  kilometer: {
    id: 'kilometer',
    name: 'Kilometers',
    symbol: 'km',
    toBase: (value: number) => value * 1000,
    fromBase: (value: number) => value / 1000,
  },
  mile: {
    id: 'mile',
    name: 'Miles',
    symbol: 'mi',
    toBase: (value: number) => value * 1609.344,
    fromBase: (value: number) => value / 1609.344,
  },
  inch: {
    id: 'inch',
    name: 'Inches',
    symbol: 'in',
    toBase: (value: number) => value * 0.0254,
    fromBase: (value: number) => value / 0.0254,
  },
  foot: {
    id: 'foot',
    name: 'Feet',
    symbol: 'ft',
    toBase: (value: number) => value * 0.3048,
    fromBase: (value: number) => value / 0.3048,
  },
  yard: {
    id: 'yard',
    name: 'Yards',
    symbol: 'yd',
    toBase: (value: number) => value * 0.9144,
    fromBase: (value: number) => value / 0.9144,
  },
  millimeter: {
    id: 'millimeter',
    name: 'Millimeters',
    symbol: 'mm',
    toBase: (value: number) => value / 1000,
    fromBase: (value: number) => value * 1000,
  },
  centimeter: {
    id: 'centimeter',
    name: 'Centimeters',
    symbol: 'cm',
    toBase: (value: number) => value / 100,
    fromBase: (value: number) => value * 100,
  },
  meter: {
    id: 'meter',
    name: 'Meters',
    symbol: 'm',
    toBase: (value: number) => value,
    fromBase: (value: number) => value,
  },
};

export interface ConversionResult {
  unitId: string;
  unitName: string;
  symbol: string;
  value: string; // Smart formatted: no decimals if whole number, 2 decimals otherwise
}

/**
 * Format a number with smart decimal handling and US-style comma separators:
 * - No decimal places if the number is a whole number
 * - 2 decimal places otherwise
 * - Commas for thousands separators (e.g., 1,000,000)
 * @param num - The number to format
 * @returns Formatted string
 */
function formatNumber(num: number): string {
  // Check if the number is effectively a whole number (accounting for floating point errors)
  const isWholeNumber = Math.abs(num - Math.round(num)) < 0.0001;

  if (isWholeNumber) {
    // Format whole number with commas
    return Math.round(num).toLocaleString('en-US');
  }

  // Format decimal number with 2 decimal places and commas
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Convert a length value from one unit to all other units
 * @param value - The numeric value to convert
 * @param fromUnitId - The ID of the source unit (e.g., 'meter', 'kilometer')
 * @returns Array of conversion results for all units
 */
export function convertLength(value: number, fromUnitId: string): ConversionResult[] {
  const fromUnit = lengthUnits[fromUnitId];

  if (!fromUnit) {
    throw new Error(`Invalid unit ID: ${fromUnitId}`);
  }

  // Convert input value to base unit (meters)
  const baseValue = fromUnit.toBase(value);

  // Convert base value to all other units
  const results: ConversionResult[] = Object.values(lengthUnits)
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
 * Get an array of all length unit names for the select dropdown
 */
export function getLengthUnitNames(): string[] {
  return Object.values(lengthUnits).map((unit) => unit.name);
}

/**
 * Get unit ID from unit name (case-insensitive)
 * @param name - The display name of the unit (e.g., 'Kilometer')
 * @returns The unit ID (e.g., 'kilometer')
 */
export function getUnitIdFromName(name: string): string | undefined {
  const unit = Object.values(lengthUnits).find((u) => u.name.toLowerCase() === name.toLowerCase());
  return unit?.id;
}
