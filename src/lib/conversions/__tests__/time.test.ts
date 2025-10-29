import { describe, it, expect } from 'vitest';
import { getCurrentTime, fromUnixSeconds, fromUnixMilliseconds } from '../time';

describe('Time Conversion', () => {
  describe('getCurrentTime', () => {
    it('returns current time in all formats', () => {
      const result = getCurrentTime();

      expect(result).toHaveProperty('unixSeconds');
      expect(result).toHaveProperty('unixMilliseconds');
      expect(result).toHaveProperty('localDatetime');
      expect(result).toHaveProperty('utcDatetime');
      expect(result).toHaveProperty('timezone');
      expect(result).toHaveProperty('isDST');

      expect(typeof result.unixSeconds).toBe('number');
      expect(typeof result.unixMilliseconds).toBe('number');
      expect(typeof result.localDatetime).toBe('string');
      expect(typeof result.utcDatetime).toBe('string');
    });

    it('has consistent timestamps', () => {
      const startTime = Date.now();
      const result = getCurrentTime();
      const endTime = Date.now();

      // Allow for some timing differences between calls
      expect(result.unixMilliseconds).toBeGreaterThanOrEqual(startTime);
      expect(result.unixMilliseconds).toBeLessThanOrEqual(endTime);

      // Check that unixSeconds is the truncated version of unixMilliseconds
      expect(Math.floor(result.unixMilliseconds / 1000)).toBe(result.unixSeconds);
    });
  });

  describe('fromUnixSeconds', () => {
    it('converts Unix epoch seconds correctly', () => {
      const timestamp = 1640995200; // 2022-01-01 00:00:00 UTC
      const result = fromUnixSeconds(timestamp);

      expect(result.unixSeconds).toBe(timestamp);
      expect(result.unixMilliseconds).toBe(timestamp * 1000);
      expect(result.utcDatetime).toContain('2022-01-01');
    });

    it('handles zero timestamp', () => {
      const result = fromUnixSeconds(0);

      expect(result.unixSeconds).toBe(0);
      expect(result.unixMilliseconds).toBe(0);
      expect(result.utcDatetime).toContain('1970-01-01');
    });
  });

  describe('fromUnixMilliseconds', () => {
    it('converts Unix epoch milliseconds correctly', () => {
      const timestamp = 1640995200000; // 2022-01-01 00:00:00 UTC
      const result = fromUnixMilliseconds(timestamp);

      expect(result.unixMilliseconds).toBe(timestamp);
      expect(result.unixSeconds).toBe(Math.floor(timestamp / 1000));
      expect(result.utcDatetime).toContain('2022-01-01');
    });
  });
});
