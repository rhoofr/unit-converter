import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Tabs Components', () => {
  const TabsExample = ({ onValueChange }: { onValueChange?: (value: string) => void }) => (
    <Tabs defaultValue='length' onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value='length'>Length</TabsTrigger>
        <TabsTrigger value='volume'>Volume</TabsTrigger>
        <TabsTrigger value='weight'>Weight</TabsTrigger>
      </TabsList>
      <TabsContent value='length'>Length converter content</TabsContent>
      <TabsContent value='volume'>Volume converter content</TabsContent>
      <TabsContent value='weight'>Weight converter content</TabsContent>
    </Tabs>
  );

  describe('Tabs', () => {
    it('renders tabs with default value', () => {
      render(<TabsExample />);

      // Check that tabs are rendered
      expect(screen.getByRole('tab', { name: 'Length' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Volume' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Weight' })).toBeInTheDocument();

      // Check default content is shown
      expect(screen.getByText('Length converter content')).toBeInTheDocument();
      expect(screen.queryByText('Volume converter content')).not.toBeInTheDocument();
    });

    it('switches tabs when clicked', async () => {
      const user = userEvent.setup();
      render(<TabsExample />);

      // Click on Volume tab
      await user.click(screen.getByRole('tab', { name: 'Volume' }));

      // Check content has switched
      expect(screen.getByText('Volume converter content')).toBeInTheDocument();
      expect(screen.queryByText('Length converter content')).not.toBeInTheDocument();
    });

    it('calls onValueChange when tab is switched', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(<TabsExample onValueChange={handleValueChange} />);

      // Click on Weight tab
      await user.click(screen.getByRole('tab', { name: 'Weight' }));

      expect(handleValueChange).toHaveBeenCalledWith('weight');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<TabsExample />);

      // Focus on first tab
      const lengthTab = screen.getByRole('tab', { name: 'Length' });
      lengthTab.focus();

      // Use arrow key to navigate
      await user.keyboard('[ArrowRight]');

      // Check that Volume tab is now focused
      expect(screen.getByRole('tab', { name: 'Volume' })).toHaveFocus();
    });
  });

  describe('TabsList', () => {
    it('renders with correct role and classes', () => {
      render(
        <Tabs defaultValue='test'>
          <TabsList data-testid='tabs-list'>
            <TabsTrigger value='test'>Test</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const tabsList = screen.getByTestId('tabs-list');
      expect(tabsList).toHaveAttribute('role', 'tablist');
      expect(tabsList).toHaveClass('bg-muted', 'text-muted-foreground', 'inline-flex', 'h-9');
    });
  });

  describe('TabsTrigger', () => {
    it('has correct accessibility attributes', () => {
      render(
        <Tabs defaultValue='length'>
          <TabsList>
            <TabsTrigger value='length'>Length</TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const trigger = screen.getByRole('tab', { name: 'Length' });
      expect(trigger).toHaveAttribute('aria-selected', 'true');
      expect(trigger).toHaveAttribute('data-state', 'active');
    });

    it('can be disabled', () => {
      render(
        <Tabs defaultValue='length'>
          <TabsList>
            <TabsTrigger value='length'>Length</TabsTrigger>
            <TabsTrigger value='disabled' disabled>
              Disabled
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );

      const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
      expect(disabledTab).toBeDisabled();
      expect(disabledTab).toHaveAttribute('data-disabled');
    });
  });

  describe('TabsContent', () => {
    it('shows content only when tab is active', () => {
      render(
        <Tabs defaultValue='length'>
          <TabsList>
            <TabsTrigger value='length'>Length</TabsTrigger>
            <TabsTrigger value='volume'>Volume</TabsTrigger>
          </TabsList>
          <TabsContent value='length'>Active content</TabsContent>
          <TabsContent value='volume'>Inactive content</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Active content')).toBeInTheDocument();
      expect(screen.queryByText('Inactive content')).not.toBeInTheDocument();
    });

    it('has correct accessibility attributes', () => {
      render(
        <Tabs defaultValue='length'>
          <TabsList>
            <TabsTrigger value='length'>Length</TabsTrigger>
          </TabsList>
          <TabsContent value='length' data-testid='content'>
            Content here
          </TabsContent>
        </Tabs>
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveAttribute('role', 'tabpanel');
      expect(content).toHaveAttribute('data-state', 'active');
    });
  });
});
