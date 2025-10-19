import { cn } from '@/lib/utils';

interface ConversionResultItemProps {
  unitName: string;
  symbol: string;
  value: string | number;
  className?: string;
}

/**
 * ConversionResultItem Component
 *
 * Displays a single conversion result in a card format.
 * Shows the unit name, symbol, and converted value.
 *
 * @param unitName - The full name of the unit (e.g., "Meters", "Feet")
 * @param symbol - The abbreviation/symbol for the unit (e.g., "m", "ft")
 * @param value - The converted value to display
 * @param className - Optional additional CSS classes for customization
 *
 * Features:
 * - Hover effect with border color change
 * - Responsive text sizing
 * - Semantic color classes for theme support
 * - Break-words to handle long numbers
 */
export function ConversionResultItem({ unitName, symbol, value, className }: ConversionResultItemProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg p-4',
        'hover:border-primary/50 transition-colors',
        className
      )}>
      <div className='flex justify-between items-center'>
        <span className='text-sm text-muted-foreground'>{unitName}</span>
        <span className='text-xs text-muted-foreground'>({symbol})</span>
      </div>
      <p className='text-xl font-bold text-foreground mt-2 break-words'>
        {value} {symbol}
      </p>
    </div>
  );
}
