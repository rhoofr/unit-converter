import type { Metadata } from 'next';
import { CategoryTabs } from '@/components/category-tabs';

export const metadata: Metadata = {
  title: 'Unit Converter - Convert Between Multiple Units',
  description: 'Convert between different units of measurement including length, volume, weight, temperature, and time',
};

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4 sm:px-6 lg:px-8'>
          <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground'>Unit Converter</h1>
          <p className='mt-2 text-sm sm:text-base text-muted-foreground'>
            Convert between different units of measurement
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
        {/* Welcome Section */}
        <section className='mb-4 lg:mb-6'>
          <h2 className='text-base sm:text-xl md:text-2xl font-semibold text-foreground mb-2'>Select a Category</h2>
          <p className='text-sm sm:text-base text-muted-foreground'>
            Choose a conversion category using the tabs below.
          </p>
        </section>

        {/* Category Tabs */}
        <CategoryTabs />
      </main>

      {/* Footer */}
      <footer className='border-t border-border bg-card mt-12'>
        <div className='container mx-auto px-4 py-6 sm:px-6 lg:px-8'>
          <p className='text-center text-sm text-muted-foreground'>Built with Next.js 15, React 19, and TypeScript</p>
        </div>
      </footer>
    </div>
  );
}
