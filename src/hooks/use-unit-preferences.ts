'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Default unit preferences for each conversion category
 * These are used as fallback values when no user preference is stored
 */

export const DEFAULT_UNIT_PREFERENCES = {
  length: 'Kilometers',
  volume: 'Liters',
  weight: 'Ounces',
  temperature: 'Celsius',
  time: 'Unix Epoch (Seconds)',
  date: 'Pick end date', // Add date category with default
  numbers: 'Compare two numbers' as NumbersPreference,
} as const;

export type NumbersPreference = 'Compare two numbers' | 'Number up/down by %';

export type CategoryId = keyof typeof DEFAULT_UNIT_PREFERENCES;
export type UnitPreferences = Omit<typeof DEFAULT_UNIT_PREFERENCES, 'numbers'> & { numbers: NumbersPreference };

const STORAGE_KEY = 'unit-converter-preferences';

/**
 * Custom hook to manage user's preferred default units for each category
 * Stores preferences in localStorage and provides methods to get/set them
 *
 * @returns Object containing preferences and setter function
 */
export function useUnitPreferences() {
  const [preferences, setPreferences] = useState<UnitPreferences>(DEFAULT_UNIT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UnitPreferences>;
        // Merge with defaults to ensure all categories have a value
        setPreferences({
          ...DEFAULT_UNIT_PREFERENCES,
          ...parsed,
        });
      }
    } catch (error) {
      console.error('Failed to load unit preferences from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Update preferences for one or more categories
   * Automatically persists to localStorage
   */
  const updatePreferences = useCallback((updates: Partial<UnitPreferences>) => {
    setPreferences((prev) => {
      const newPreferences = {
        ...prev,
        ...updates,
      };

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      } catch (error) {
        console.error('Failed to save unit preferences to localStorage:', error);
      }

      return newPreferences;
    });
  }, []);

  /**
   * Reset all preferences to default values
   */
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_UNIT_PREFERENCES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset unit preferences:', error);
    }
  }, []);

  /**
   * Get the default unit for a specific category
   */
  const getDefaultUnit = useCallback(
    (categoryId: CategoryId): string => {
      return preferences[categoryId];
    },
    [preferences]
  );

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    getDefaultUnit,
    isLoaded, // Useful to prevent hydration mismatches
  };
}
