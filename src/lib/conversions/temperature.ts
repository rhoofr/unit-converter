/**
 * Temperature Conversion Utilities
 * Note: Temperature conversions use direct formulas rather than a base unit
 * because the relationships are not simple multiplication/division.
 */

export interface TemperatureUnit {
  id: string;
  name: string;
  symbol: string;
}

export const temperatureUnits: Record<string, TemperatureUnit> = {
  celsius: {
    id: 'celsius',
    name: 'Celsius',
    symbol: '°C',
  },
  fahrenheit: {
    id: 'fahrenheit',
    name: 'Fahrenheit',
    symbol: '°F',
  },
  kelvin: {
    id: 'kelvin',
    name: 'Kelvin',
    symbol: 'K',
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
 * Convert Celsius to Fahrenheit
 * Formula: °F = (°C × 9/5) + 32
 */
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert Celsius to Kelvin
 * Formula: K = °C + 273.15
 */
function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

/**
 * Convert Fahrenheit to Celsius
 * Formula: °C = (°F - 32) × 5/9
 */
function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Convert Fahrenheit to Kelvin
 * Formula: K = (°F - 32) × 5/9 + 273.15
 */
function fahrenheitToKelvin(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9 + 273.15;
}

/**
 * Convert Kelvin to Celsius
 * Formula: °C = K - 273.15
 */
function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

/**
 * Convert Kelvin to Fahrenheit
 * Formula: °F = (K - 273.15) × 9/5 + 32
 */
function kelvinToFahrenheit(kelvin: number): number {
  return ((kelvin - 273.15) * 9) / 5 + 32;
}

/**
 * Convert a temperature value from one unit to all other units
 * @param value - The numeric value to convert
 * @param fromUnitId - The ID of the source unit (e.g., 'celsius', 'fahrenheit', 'kelvin')
 * @returns Array of conversion results for all units
 */
export function convertTemperature(value: number, fromUnitId: string): ConversionResult[] {
  const fromUnit = temperatureUnits[fromUnitId];

  if (!fromUnit) {
    throw new Error(`Invalid unit ID: ${fromUnitId}`);
  }

  const results: ConversionResult[] = [];

  // Convert based on source unit
  switch (fromUnitId) {
    case 'celsius':
      results.push({
        unitId: 'fahrenheit',
        unitName: 'Fahrenheit',
        symbol: '°F',
        value: formatNumber(celsiusToFahrenheit(value)),
      });
      results.push({
        unitId: 'kelvin',
        unitName: 'Kelvin',
        symbol: 'K',
        value: formatNumber(celsiusToKelvin(value)),
      });
      break;

    case 'fahrenheit':
      results.push({
        unitId: 'celsius',
        unitName: 'Celsius',
        symbol: '°C',
        value: formatNumber(fahrenheitToCelsius(value)),
      });
      results.push({
        unitId: 'kelvin',
        unitName: 'Kelvin',
        symbol: 'K',
        value: formatNumber(fahrenheitToKelvin(value)),
      });
      break;

    case 'kelvin':
      results.push({
        unitId: 'celsius',
        unitName: 'Celsius',
        symbol: '°C',
        value: formatNumber(kelvinToCelsius(value)),
      });
      results.push({
        unitId: 'fahrenheit',
        unitName: 'Fahrenheit',
        symbol: '°F',
        value: formatNumber(kelvinToFahrenheit(value)),
      });
      break;

    default:
      throw new Error(`Unsupported temperature unit: ${fromUnitId}`);
  }

  return results;
}

/**
 * Get an array of all temperature unit names for the select dropdown
 */
export function getTemperatureUnitNames(): string[] {
  return Object.values(temperatureUnits).map((unit) => unit.name);
}

/**
 * Get unit ID from unit name (case-insensitive)
 * @param name - The display name of the unit (e.g., 'Celsius')
 * @returns The unit ID (e.g., 'celsius')
 */
export function getUnitIdFromName(name: string): string | undefined {
  const unit = Object.values(temperatureUnits).find((u) => u.name.toLowerCase() === name.toLowerCase());
  return unit?.id;
}
