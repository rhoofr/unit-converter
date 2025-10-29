import { describe, it, expect } from 'vitest';
import { convertVolume, getUnitIdFromName } from '../volume';

describe('Volume Conversion', () => {
  describe('convertVolume', () => {
    it('converts liters to all other units correctly', () => {
      const results = convertVolume(1, 'liter');

      expect(results).toHaveLength(6); // 7 units - 1 (source unit)

      // Find specific conversions
      const mlResult = results.find((r) => r.unitId === 'milliliter');
      const galResult = results.find((r) => r.unitId === 'gallon');
      const cupResult = results.find((r) => r.unitId === 'cup');

      expect(mlResult?.value).toBe('1,000');
      expect(galResult?.value).toBe('0.26');
      expect(cupResult?.value).toBe('4.23');
    });

    it('converts gallons to liters', () => {
      const results = convertVolume(1, 'gallon');
      const literResult = results.find((r) => r.unitId === 'liter');

      expect(literResult?.value).toBe('3.79');
    });

    it('converts milliliters to liters', () => {
      const results = convertVolume(1000, 'milliliter');
      const literResult = results.find((r) => r.unitId === 'liter');

      expect(literResult?.value).toBe('1');
    });

    it('handles decimal inputs correctly', () => {
      const results = convertVolume(2.5, 'liter');
      const galResult = results.find((r) => r.unitId === 'gallon');

      expect(galResult?.value).toBe('0.66');
    });

    it('throws error for invalid unit ID', () => {
      expect(() => convertVolume(1, 'invalid-unit')).toThrow('Invalid unit ID: invalid-unit');
    });
  });

  describe('getUnitIdFromName', () => {
    it('returns correct unit ID for valid name', () => {
      expect(getUnitIdFromName('Liters')).toBe('liter');
      expect(getUnitIdFromName('Gallons')).toBe('gallon');
      expect(getUnitIdFromName('Milliliters')).toBe('milliliter');
    });

    it('handles case-insensitive names', () => {
      expect(getUnitIdFromName('liters')).toBe('liter');
      expect(getUnitIdFromName('LITERS')).toBe('liter');
    });

    it('returns undefined for invalid name', () => {
      expect(getUnitIdFromName('InvalidUnit')).toBeUndefined();
    });
  });
});
