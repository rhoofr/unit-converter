import { describe, it, expect } from 'vitest';
import { formatNumber } from '../conversion-utils';

describe('Conversion Utils', () => {
  describe('formatNumber', () => {
    it('formats small decimal numbers correctly', () => {
      expect(formatNumber(0.25)).toBe('0.25');
      expect(formatNumber(0.1)).toBe('0.10');
      expect(formatNumber(0.99)).toBe('0.99');
    });

    it('formats whole numbers without decimals', () => {
      expect(formatNumber(1)).toBe('1');
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(0)).toBe('0');
    });

    it('formats large numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('handles decimal precision with 2 decimal places', () => {
      expect(formatNumber(3.14159)).toBe('3.14');
      expect(formatNumber(10.999)).toBe('11.00');
    });

    it('handles negative values', () => {
      expect(formatNumber(-5)).toBe('-5');
      expect(formatNumber(-1000)).toBe('-1,000');
      expect(formatNumber(-5.25)).toBe('-5.25');
    });
  });
});
