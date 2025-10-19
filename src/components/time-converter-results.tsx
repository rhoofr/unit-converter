'use client';

import * as React from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCurrentTime, formatLocalDatetimeDisplay, formatUTCDatetimeDisplay } from '@/lib/conversions/time';
import type { TimeConversionResult } from '@/lib/conversions/time';

export function TimeConverterResults() {
  const [timeData, setTimeData] = React.useState<TimeConversionResult | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Load current time on mount
  React.useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const currentTime = getCurrentTime();
    setTimeData(currentTime);

    // Brief animation delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 300);
  };

  if (!timeData) {
    return (
      <div className='bg-muted/50 rounded-lg p-8 text-center'>
        <Clock className='h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse' />
        <p className='text-muted-foreground'>Loading current time...</p>
      </div>
    );
  }

  const timeUnits = [
    {
      id: 'unix-seconds',
      name: 'Unix Epoch (Seconds)',
      displayValue: String(timeData.unixSeconds),
    },
    {
      id: 'unix-milliseconds',
      name: 'Unix Epoch (Milliseconds)',
      displayValue: String(timeData.unixMilliseconds),
    },
    {
      id: 'local-datetime',
      name: 'Local Datetime',
      displayValue: formatLocalDatetimeDisplay(timeData.localDatetime, timeData.timezone, timeData.isDST),
    },
    {
      id: 'utc-datetime',
      name: 'UTC Datetime',
      displayValue: formatUTCDatetimeDisplay(timeData.utcDatetime),
    },
  ];

  return (
    <div className='space-y-4'>
      {/* Header with Refresh Button */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Clock className='h-5 w-5 text-primary' />
          <h3 className='text-base sm:text-lg font-semibold text-foreground'>Current Time</h3>
        </div>
        <Button onClick={handleRefresh} variant='outline' size='sm' disabled={isRefreshing} className='gap-2'>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Time Display Card */}
      <Card>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            {timeUnits.map((unit) => (
              <div key={unit.id} className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <span className='text-xs sm:text-sm font-medium text-muted-foreground min-w-[200px]'>{unit.name}</span>
                <span className='font-mono text-xs sm:text-sm text-foreground break-all'>{unit.displayValue}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
