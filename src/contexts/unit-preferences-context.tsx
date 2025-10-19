'use client';

import * as React from 'react';
import { useUnitPreferences } from '@/hooks/use-unit-preferences';
import type { CategoryId, UnitPreferences } from '@/hooks/use-unit-preferences';

interface UnitPreferencesContextValue {
  preferences: UnitPreferences;
  updatePreferences: (updates: Partial<UnitPreferences>) => void;
  resetPreferences: () => void;
  getDefaultUnit: (categoryId: CategoryId) => string;
  isLoaded: boolean;
}

const UnitPreferencesContext = React.createContext<UnitPreferencesContextValue | undefined>(undefined);

export function UnitPreferencesProvider({ children }: { children: React.ReactNode }) {
  const value = useUnitPreferences();

  return <UnitPreferencesContext.Provider value={value}>{children}</UnitPreferencesContext.Provider>;
}

export function useUnitPreferencesContext() {
  const context = React.useContext(UnitPreferencesContext);
  if (context === undefined) {
    throw new Error('useUnitPreferencesContext must be used within a UnitPreferencesProvider');
  }
  return context;
}
