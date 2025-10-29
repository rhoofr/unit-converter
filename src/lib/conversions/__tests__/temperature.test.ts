import { describe, it, expect } from 'vitest';
import { convertTemperature, getUnitIdFromName } from '../temperature';

describe('Temperature Conversion', () => {
  describe('convertTemperature', () => {
    it('converts Celsius to all other units correctly', () => {
      const results = convertTemperature(0, 'celsius');

      expect(results).toHaveLength(2); // 3 units - 1 (source unit)

      // Find specific conversions
      const fahrenheitResult = results.find((r) => r.unitId === 'fahrenheit');
      const kelvinResult = results.find((r) => r.unitId === 'kelvin');

      expect(fahrenheitResult?.value).toBe('32');
      expect(kelvinResult?.value).toBe('273.15');
    });

    it('converts Fahrenheit to Celsius', () => {
      const results = convertTemperature(32, 'fahrenheit');
      const celsiusResult = results.find((r) => r.unitId === 'celsius');

      expect(celsiusResult?.value).toBe('0');
    });

    it('converts boiling point correctly', () => {
      const results = convertTemperature(100, 'celsius');
      const fahrenheitResult = results.find((r) => r.unitId === 'fahrenheit');

      expect(fahrenheitResult?.value).toBe('212');
    });

    it('converts Kelvin to Celsius', () => {
      const results = convertTemperature(273.15, 'kelvin');
      const celsiusResult = results.find((r) => r.unitId === 'celsius');

      expect(celsiusResult?.value).toBe('0');
    });

    it('handles decimal inputs correctly', () => {
      const results = convertTemperature(25.5, 'celsius');
      const fahrenheitResult = results.find((r) => r.unitId === 'fahrenheit');

      expect(fahrenheitResult?.value).toBe('77.90'); // Formatted with 2 decimal places
    });

    it('throws error for invalid unit ID', () => {
      expect(() => convertTemperature(1, 'invalid-unit')).toThrow('Invalid unit ID: invalid-unit');
    });
  });

  describe('getUnitIdFromName', () => {
    it('returns correct unit ID for valid name', () => {
      expect(getUnitIdFromName('Celsius')).toBe('celsius');
      expect(getUnitIdFromName('Fahrenheit')).toBe('fahrenheit');
      expect(getUnitIdFromName('Kelvin')).toBe('kelvin');
    });

    it('handles case-insensitive names', () => {
      expect(getUnitIdFromName('celsius')).toBe('celsius');
      expect(getUnitIdFromName('CELSIUS')).toBe('celsius');
    });

    it('returns undefined for invalid name', () => {
      expect(getUnitIdFromName('InvalidUnit')).toBeUndefined();
    });
  });
});
