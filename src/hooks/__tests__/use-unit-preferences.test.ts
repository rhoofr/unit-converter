import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUnitPreferences, DEFAULT_UNIT_PREFERENCES } from '../use-unit-preferences';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useUnitPreferences', () => {
  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  afterEach(() => {
    // Restore console methods after each test
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  it('loads default preferences when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useUnitPreferences());

    expect(result.current.preferences).toEqual(DEFAULT_UNIT_PREFERENCES);
    expect(result.current.isLoaded).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('unit-converter-preferences');
  });

  it('loads preferences from localStorage when valid JSON exists', () => {
    const storedPrefs = {
      ...DEFAULT_UNIT_PREFERENCES,
      length: 'Miles',
      volume: 'Gallons',
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedPrefs));

    const { result } = renderHook(() => useUnitPreferences());

    expect(result.current.preferences.length).toBe('Miles');
    expect(result.current.preferences.volume).toBe('Gallons');
    expect(result.current.isLoaded).toBe(true);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    // Mock console.error to prevent the error from appearing in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    localStorageMock.getItem.mockReturnValue('invalid-json');

    const { result } = renderHook(() => useUnitPreferences());

    // Should fall back to default preferences
    expect(result.current.preferences).toEqual(DEFAULT_UNIT_PREFERENCES);
    expect(result.current.isLoaded).toBe(true);

    // Verify that the error was logged (but suppressed in test output)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load unit preferences from localStorage:',
      expect.any(SyntaxError)
    );

    // Restore console.error
    consoleSpy.mockRestore();
  });

  it('handles malformed but parseable JSON gracefully', () => {
    // Test with JSON that parses but doesn't match expected structure
    localStorageMock.getItem.mockReturnValue('{"invalidStructure": true}');

    const { result } = renderHook(() => useUnitPreferences());

    // Should merge with defaults for missing properties
    expect(result.current.preferences).toEqual(expect.objectContaining(DEFAULT_UNIT_PREFERENCES));
    expect(result.current.isLoaded).toBe(true);
  });

  it('updates preferences and saves to localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useUnitPreferences());

    act(() => {
      result.current.updatePreferences({ length: 'Kilometers' });
    });

    expect(result.current.preferences.length).toBe('Kilometers');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'unit-converter-preferences',
      expect.stringContaining('Kilometers')
    );
  });

  it('partially updates preferences while preserving others', () => {
    const initialPrefs = {
      ...DEFAULT_UNIT_PREFERENCES,
      length: 'Miles',
      volume: 'Gallons',
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(initialPrefs));

    const { result } = renderHook(() => useUnitPreferences());

    act(() => {
      result.current.updatePreferences({ length: 'Kilometers' });
    });

    expect(result.current.preferences.length).toBe('Kilometers');
    expect(result.current.preferences.volume).toBe('Gallons'); // Preserved
    expect(result.current.preferences.weight).toBe(DEFAULT_UNIT_PREFERENCES.weight); // Preserved
  });

  it('handles localStorage setItem errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage is full');
    });

    const { result } = renderHook(() => useUnitPreferences());

    act(() => {
      result.current.updatePreferences({ length: 'Kilometers' });
    });

    // Preferences should still update in memory
    expect(result.current.preferences.length).toBe('Kilometers');

    // Error should be logged
    expect(consoleSpy).toHaveBeenCalledWith('Failed to save unit preferences to localStorage:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('maintains referential stability of updatePreferences function', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result, rerender } = renderHook(() => useUnitPreferences());

    const firstUpdateFn = result.current.updatePreferences;

    rerender();

    const secondUpdateFn = result.current.updatePreferences;

    expect(firstUpdateFn).toBe(secondUpdateFn);
  });
});
