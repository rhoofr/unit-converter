/**
 * Shared Conversion Utilities
 * Common types and functions used across all conversion modules
 */

/**
 * Standard format for conversion results across all conversion types
 */
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
export function formatNumber(num: number): string {
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
