import type { Metadata } from 'next';
import { CategoryTabs } from '@/components/category-tabs';
import { AppHeader } from '@/components/app-header';

export const metadata: Metadata = {
  title: 'Unit Converter - Convert Between Multiple Units',
  description: 'Convert between different units of measurement including length, volume, weight, temperature, and time',
};

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <main className='container mx-auto px-4 py-4 sm:px-6 lg:px-8 lg:py-6'>
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
    </div>
  );
}
