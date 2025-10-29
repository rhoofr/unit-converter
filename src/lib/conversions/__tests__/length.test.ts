import { describe, it, expect } from 'vitest';
import { convertLength, getUnitIdFromName } from '../length';

describe('Length Conversion', () => {
  describe('convertLength', () => {
    it('converts meters to all other units correctly', () => {
      const results = convertLength(1, 'meter');

      expect(results).toHaveLength(8); // 9 units - 1 (source unit)

      // Find specific conversions
      const kmResult = results.find((r) => r.unitId === 'kilometer');
      const cmResult = results.find((r) => r.unitId === 'centimeter');
      const ftResult = results.find((r) => r.unitId === 'foot');

      expect(kmResult?.value).toBe('0.00'); // Very small value rounds to 0.00 with 2 decimal formatting
      expect(cmResult?.value).toBe('100');
      expect(ftResult?.value).toBe('3.28');
    });

    it('converts kilometers to miles', () => {
      const results = convertLength(1, 'kilometer');
      const mileResult = results.find((r) => r.unitId === 'mile');

      expect(mileResult?.value).toBe('0.62');
    });

    it('handles decimal inputs correctly', () => {
      const results = convertLength(2.5, 'meter');
      const ftResult = results.find((r) => r.unitId === 'foot');

      expect(ftResult?.value).toBe('8.20'); // Formatted with 2 decimal places
    });

    it('throws error for invalid unit ID', () => {
      expect(() => convertLength(1, 'invalid-unit')).toThrow('Invalid unit ID: invalid-unit');
    });
  });

  describe('getUnitIdFromName', () => {
    it('returns correct unit ID for valid name', () => {
      expect(getUnitIdFromName('Kilometers')).toBe('kilometer');
      expect(getUnitIdFromName('Miles')).toBe('mile');
      expect(getUnitIdFromName('Meters')).toBe('meter');
    });

    it('handles case-insensitive names', () => {
      expect(getUnitIdFromName('kilometers')).toBe('kilometer');
      expect(getUnitIdFromName('KILOMETERS')).toBe('kilometer');
    });

    it('returns undefined for invalid name', () => {
      expect(getUnitIdFromName('InvalidUnit')).toBeUndefined();
    });
  });
});
