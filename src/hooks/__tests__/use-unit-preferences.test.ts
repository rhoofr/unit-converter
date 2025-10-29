import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUnitPreferences } from '../use-unit-preferences';

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

// Mock the default preferences to match your actual implementation
const DEFAULT_UNIT_PREFERENCES = {
  length: 'Kilometers',
  volume: 'Liters',
  weight: 'Ounces',
  temperature: 'Celsius',
  time: 'Unix Epoch (Seconds)',
};

describe('useUnitPreferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads default preferences when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useUnitPreferences());

    expect(result.current.preferences).toEqual(DEFAULT_UNIT_PREFERENCES);
    expect(result.current.isLoaded).toBe(true);
  });

  it('loads preferences from localStorage', () => {
    const storedPrefs = { ...DEFAULT_UNIT_PREFERENCES, length: 'Miles' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedPrefs));

    const { result } = renderHook(() => useUnitPreferences());

    expect(result.current.preferences.length).toBe('Miles');
    expect(result.current.isLoaded).toBe(true);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    const { result } = renderHook(() => useUnitPreferences());

    expect(result.current.preferences).toEqual(DEFAULT_UNIT_PREFERENCES);
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

  it('updates multiple preferences at once', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useUnitPreferences());

    act(() => {
      result.current.updatePreferences({
        length: 'Miles',
        weight: 'Pounds',
        temperature: 'Fahrenheit',
      });
    });

    expect(result.current.preferences.length).toBe('Miles');
    expect(result.current.preferences.weight).toBe('Pounds');
    expect(result.current.preferences.temperature).toBe('Fahrenheit');
    expect(result.current.preferences.volume).toBe('Liters'); // unchanged
  });

  it('preserves existing preferences when updating partial preferences', () => {
    const storedPrefs = {
      ...DEFAULT_UNIT_PREFERENCES,
      length: 'Kilometers',
      weight: 'Pounds',
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedPrefs));

    const { result } = renderHook(() => useUnitPreferences());

    act(() => {
      result.current.updatePreferences({ temperature: 'Fahrenheit' });
    });

    expect(result.current.preferences.length).toBe('Kilometers'); // preserved
    expect(result.current.preferences.weight).toBe('Pounds'); // preserved
    expect(result.current.preferences.temperature).toBe('Fahrenheit'); // updated
  });
});
