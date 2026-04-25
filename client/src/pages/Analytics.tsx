import { useState } from 'react';
import { AnalyticsStatCards } from '../components/features/analytics/AnalyticsStatCards';
import { DailyClicksChart } from '../components/features/analytics/DailyClicksChart';
import { DevicesChart } from '../components/features/analytics/DevicesChart';
import { TopReferrersTable } from '../components/features/analytics/TopReferrersTable';
import { TopLocationsTable } from '../components/features/analytics/TopLocationsTable';
import { Select } from '../components/ui/Select';

const dateOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '14d', label: 'Last 14 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

export default function Analytics() {
  const [dateRangeStr, setDateRangeStr] = useState('14d');
  
  // Convert '14d' to a from/to object to pass to queries
  const dateRange = {
    from: new Date(Date.now() - parseInt(dateRangeStr) * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics Overview</h1>
          <p className="text-sm text-text-secondary mt-1">
            Deep dive into your traffic sources, locations, and device metrics.
          </p>
        </div>
        <div className="w-48">
          <Select 
            options={dateOptions}
            value={dateRangeStr}
            onChange={(e) => setDateRangeStr(e.target.value)}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <AnalyticsStatCards dateRange={dateRange} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DailyClicksChart dateRange={dateRange} />
        </div>
        <div className="lg:col-span-1">
          <DevicesChart dateRange={dateRange} />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="col-span-1">
          <TopReferrersTable dateRange={dateRange} />
        </div>
        <div className="col-span-1">
          <TopLocationsTable dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
}
