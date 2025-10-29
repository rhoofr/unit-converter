import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default classes', () => {
      render(<Card data-testid='card'>Test Card</Card>);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bg-card', 'text-card-foreground', 'flex', 'flex-col');
    });

    it('accepts custom className', () => {
      render(
        <Card className='custom-class' data-testid='card'>
          Content
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    it('renders children correctly', () => {
      render(
        <Card>
          <div>Child content</div>
        </Card>
      );

      expect(screen.getByText('Child content')).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('renders with correct classes', () => {
      render(<CardHeader data-testid='header'>Header Content</CardHeader>);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('grid', 'auto-rows-min', 'items-start', 'gap-2', 'px-6');
    });
  });

  describe('CardTitle', () => {
    it('renders as div with correct text', () => {
      render(<CardTitle data-testid='title'>Test Title</CardTitle>);

      const title = screen.getByTestId('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Test Title');
    });

    it('applies correct styling', () => {
      render(<CardTitle data-testid='title'>Styled Title</CardTitle>);

      const title = screen.getByTestId('title');
      expect(title).toHaveClass('leading-none', 'font-semibold');
    });
  });

  describe('CardContent', () => {
    it('renders with correct padding', () => {
      render(<CardContent data-testid='content'>Content here</CardContent>);

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('px-6');
    });
  });

  describe('Complete Card Structure', () => {
    it('renders full card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid='card-title'>Unit Converter</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Convert between different units</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByTestId('card-title')).toHaveTextContent('Unit Converter');
      expect(screen.getByText('Convert between different units')).toBeInTheDocument();
    });
  });
});
