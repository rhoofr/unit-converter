import { describe, it, expect } from 'vitest';
import { convertWeight, getUnitIdFromName } from '../weight';

describe('Weight Conversion', () => {
  describe('convertWeight', () => {
    it('converts kilograms to all other units correctly', () => {
      const results = convertWeight(1, 'kilogram');

      expect(results).toHaveLength(6); // 7 units - 1 (source unit)

      // Find specific conversions
      const gramResult = results.find((r) => r.unitId === 'gram');
      const poundResult = results.find((r) => r.unitId === 'pound');
      const ounceResult = results.find((r) => r.unitId === 'ounce');

      expect(gramResult?.value).toBe('1,000');
      expect(poundResult?.value).toBe('2.20');
      expect(ounceResult?.value).toBe('35.27');
    });

    it('converts pounds to kilograms', () => {
      const results = convertWeight(1, 'pound');
      const kgResult = results.find((r) => r.unitId === 'kilogram');

      expect(kgResult?.value).toBe('0.45');
    });

    it('converts ounces to grams', () => {
      const results = convertWeight(1, 'ounce');
      const gramResult = results.find((r) => r.unitId === 'gram');

      expect(gramResult?.value).toBe('28.35');
    });

    it('handles decimal inputs correctly', () => {
      const results = convertWeight(2.5, 'kilogram');
      const poundResult = results.find((r) => r.unitId === 'pound');

      expect(poundResult?.value).toBe('5.51');
    });

    it('throws error for invalid unit ID', () => {
      expect(() => convertWeight(1, 'invalid-unit')).toThrow('Invalid unit ID: invalid-unit');
    });
  });

  describe('getUnitIdFromName', () => {
    it('returns correct unit ID for valid name', () => {
      expect(getUnitIdFromName('Kilograms')).toBe('kilogram');
      expect(getUnitIdFromName('Pounds')).toBe('pound');
      expect(getUnitIdFromName('Grams')).toBe('gram');
    });

    it('handles case-insensitive names', () => {
      expect(getUnitIdFromName('kilograms')).toBe('kilogram');
      expect(getUnitIdFromName('KILOGRAMS')).toBe('kilogram');
    });

    it('returns undefined for invalid name', () => {
      expect(getUnitIdFromName('InvalidUnit')).toBeUndefined();
    });
  });
});
