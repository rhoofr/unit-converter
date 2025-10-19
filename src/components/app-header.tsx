'use client';

import * as React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui';
import { PreferencesDialog } from '@/components/preferences-dialog';

interface AppHeaderProps {
  title?: string;
  description?: string;
}

export function AppHeader({
  title = 'Unit Converter',
  description = 'Convert between different units of measurement',
}: AppHeaderProps) {
  const [preferencesOpen, setPreferencesOpen] = React.useState(false);

  return (
    <>
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-1'>
              <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground'>{title}</h1>
              <p className='mt-2 text-sm sm:text-base text-muted-foreground'>{description}</p>
            </div>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setPreferencesOpen(true)}
              className='shrink-0'
              aria-label='Open preferences'>
              <Settings className='h-5 w-5' />
            </Button>
          </div>
        </div>
      </header>

      <PreferencesDialog open={preferencesOpen} onOpenChange={setPreferencesOpen} />
    </>
  );
}
