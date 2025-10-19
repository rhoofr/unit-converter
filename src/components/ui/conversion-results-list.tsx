import { ConversionResultItem } from './conversion-result-item';

export interface ConversionResult {
  unitId: string;
  unitName: string;
  symbol: string;
  value: string | number;
}

interface ConversionResultsListProps {
  results: ConversionResult[];
  title?: string;
  emptyMessage?: string;
}

/**
 * ConversionResultsList Component
 *
 * Displays a responsive grid of conversion results.
 * Can be used across different conversion types (length, weight, temperature, etc.)
 *
 * @param results - Array of conversion results to display
 * @param title - Optional heading to display above results (default: "Conversion Results")
 * @param emptyMessage - Optional message to show when no results (default: "No conversion results available.")
 *
 * Features:
 * - Responsive grid layout (1 col mobile, 3 cols tablet, 4 cols desktop)
 * - Automatic empty state handling
 * - Customizable title and empty message
 * - Semantic spacing and typography
 *
 * Layout Breakpoints:
 * - Mobile (default): 1 column
 * - sm (640px+): 3 columns
 * - lg (1024px+): 4 columns
 */
export function ConversionResultsList({
  results,
  title = 'Conversion Results',
  emptyMessage = 'No conversion results available.',
}: ConversionResultsListProps) {
  // Show empty state if no results
  if (results.length === 0) {
    return (
      <div className='text-center text-muted-foreground py-8'>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className='border-t border-border pt-6'>
      <h3 className='text-lg font-semibold text-foreground mb-4'>{title}</h3>
      <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
        {results.map((result) => (
          <ConversionResultItem
            key={result.unitId}
            unitName={result.unitName}
            symbol={result.symbol}
            value={result.value}
          />
        ))}
      </div>
    </div>
  );
}
