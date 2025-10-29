import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnitConverterForm } from '../unit-converter-form';
import { convertLength, getUnitIdFromName } from '@/lib/conversions/length';

describe('UnitConverterForm', () => {
  const defaultProps = {
    defaultUnit: 'Meters',
    availableUnits: ['Meters', 'Kilometers', 'Miles'],
    convertFunction: convertLength,
    getUnitIdFunction: getUnitIdFromName,
    isActive: true,
  };

  it('renders form with input and select', () => {
    render(<UnitConverterForm {...defaultProps} />);

    expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/from unit/i)).toBeInTheDocument();
  });

  it('displays default unit in select', () => {
    render(<UnitConverterForm {...defaultProps} />);

    // Look for the select display value specifically
    const selectButton = screen.getByRole('combobox', { name: /from unit/i });
    expect(selectButton).toHaveTextContent('Meters');
  });

  it('auto-converts on valid input', async () => {
    const user = userEvent.setup();
    render(<UnitConverterForm {...defaultProps} />);

    const input = screen.getByLabelText(/value/i);
    await user.type(input, '100');

    // Wait for auto-conversion (debounced)
    await waitFor(
      () => {
        // Check for results heading
        expect(screen.getByText(/conversion results/i)).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('validates numeric input', async () => {
    const user = userEvent.setup();
    render(<UnitConverterForm {...defaultProps} />);

    const input = screen.getByLabelText(/value/i);
    await user.type(input, 'abc');

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid number/i)).toBeInTheDocument();
    });
  });

  // Updated test: Use keyboard navigation instead of clicking options
  it('changes unit using keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<UnitConverterForm {...defaultProps} />);

    // Enter value first
    const input = screen.getByLabelText(/value/i);
    await user.type(input, '100');

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/conversion results/i)).toBeInTheDocument();
    });

    // Focus the select and use keyboard navigation
    const selectButton = screen.getByRole('combobox', { name: /from unit/i });
    await user.click(selectButton);

    // Use keyboard to navigate (Arrow Down + Enter)
    await user.keyboard('[ArrowDown][Enter]');

    // Check that the select value changed
    await waitFor(() => {
      expect(selectButton).toHaveTextContent('Kilometers');
    });
  });

  it('focuses input on mount', () => {
    render(<UnitConverterForm {...defaultProps} />);

    const input = screen.getByLabelText(/value/i);
    expect(input).toHaveFocus();
  });
});
