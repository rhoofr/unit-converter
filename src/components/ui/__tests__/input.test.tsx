import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input placeholder='Test input' />);
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
  });

  it('accepts input value', async () => {
    const user = userEvent.setup();
    render(<Input placeholder='Test input' />);

    const input = screen.getByPlaceholderText('Test input');
    await user.type(input, 'Hello World');

    expect(input).toHaveValue('Hello World');
  });

  it('handles onChange events', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input placeholder='Test input' onChange={handleChange} />);

    const input = screen.getByPlaceholderText('Test input');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4); // called for each character
  });

  it('can be disabled', () => {
    render(<Input placeholder='Test input' disabled />);

    const input = screen.getByPlaceholderText('Test input');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input placeholder='Test input' className='custom-class' />);

    const input = screen.getByPlaceholderText('Test input');
    expect(input).toHaveClass('custom-class');
  });

  it('accepts different input types', () => {
    render(<Input type='email' placeholder='Email input' />);

    const input = screen.getByPlaceholderText('Email input');
    expect(input).toHaveAttribute('type', 'email');
  });
});
