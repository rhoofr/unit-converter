import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryTabs } from '../category-tabs';
import { UnitPreferencesProvider } from '@/contexts/unit-preferences-context';

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <UnitPreferencesProvider>{children}</UnitPreferencesProvider>
);

// Mock the conversion functions
vi.mock('@/lib/conversions/length', () => ({
  convertLength: vi.fn(),
  getUnitIdFromName: vi.fn(),
}));

vi.mock('@/lib/conversions/volume', () => ({
  convertVolume: vi.fn(),
  getUnitIdFromName: vi.fn(),
}));

vi.mock('@/lib/conversions/weight', () => ({
  convertWeight: vi.fn(),
  getUnitIdFromName: vi.fn(),
}));

vi.mock('@/lib/conversions/temperature', () => ({
  convertTemperature: vi.fn(),
  getUnitIdFromName: vi.fn(),
}));

vi.mock('@/lib/conversions/time', () => ({
  convertTime: vi.fn(),
  getUnitIdFromName: vi.fn(),
}));

describe('CategoryTabs Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all category tabs', () => {
    render(<CategoryTabs />, { wrapper: TestWrapper });

    expect(screen.getByRole('tab', { name: /length/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /volume/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /weight/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /temperature/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /time/i })).toBeInTheDocument();
  });

  it('shows length converter by default', () => {
    render(<CategoryTabs />, { wrapper: TestWrapper });

    // Length tab should be active
    expect(screen.getByRole('tab', { name: /length/i })).toHaveAttribute('aria-selected', 'true');

    // Should show length converter content
    expect(screen.getByText(/length converter/i)).toBeInTheDocument();
  });

  it('switches to volume converter when volume tab is clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryTabs />, { wrapper: TestWrapper });

    // Click on volume tab
    await user.click(screen.getByRole('tab', { name: /volume/i }));

    // Volume tab should now be active
    expect(screen.getByRole('tab', { name: /volume/i })).toHaveAttribute('aria-selected', 'true');

    // Should show volume converter content
    await waitFor(() => {
      expect(screen.getByText(/volume converter/i)).toBeInTheDocument();
    });
  });

  it('switches to temperature converter and handles different unit types', async () => {
    const user = userEvent.setup();
    render(<CategoryTabs />, { wrapper: TestWrapper });

    // Click on temperature tab
    await user.click(screen.getByRole('tab', { name: /temperature/i }));

    // Temperature tab should be active
    expect(screen.getByRole('tab', { name: /temperature/i })).toHaveAttribute('aria-selected', 'true');

    // Should show temperature converter content
    await waitFor(() => {
      expect(screen.getByText(/temperature converter/i)).toBeInTheDocument();
    });
  });

  it('maintains converter state when switching between tabs', async () => {
    const user = userEvent.setup();
    render(<CategoryTabs />, { wrapper: TestWrapper });

    // Enter value in length converter
    const lengthInput = screen.getByLabelText(/value/i);
    await user.type(lengthInput, '100');

    // Switch to volume tab
    await user.click(screen.getByRole('tab', { name: /volume/i }));

    // Switch back to length tab
    await user.click(screen.getByRole('tab', { name: /length/i }));

    // Input should be cleared (since form resets on tab change)
    expect(screen.getByLabelText(/value/i)).toHaveValue('');
  });

  it('supports keyboard navigation between tabs', () => {
    render(<CategoryTabs />, { wrapper: TestWrapper });

    // Get the active tab (length should be active by default)
    const lengthTab = screen.getByRole('tab', { name: /length/i });

    // Active tab should be keyboard accessible
    expect(lengthTab).toHaveAttribute('role', 'tab');
    expect(lengthTab).toHaveAttribute('aria-selected', 'true');

    // Check that tabs have proper accessibility setup
    const allTabs = screen.getAllByRole('tab');
    expect(allTabs).toHaveLength(5); // length, volume, weight, temperature, time
  });
  it('preserves accessibility attributes', () => {
    render(<CategoryTabs />, { wrapper: TestWrapper });

    // Check that tabs have proper ARIA attributes
    const lengthTab = screen.getByRole('tab', { name: /length/i });
    expect(lengthTab).toHaveAttribute('aria-selected');
    expect(lengthTab).toHaveAttribute('id');
    expect(lengthTab).toHaveAttribute('aria-controls');

    // Check that tab panels have proper attributes
    const tabPanel = screen.getByRole('tabpanel');
    expect(tabPanel).toHaveAttribute('aria-labelledby');
  });
});
