import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchGlobalAnalytics } from '../../../lib/api/analytics';
import { Skeleton } from '../../ui/Skeleton';
import { formatNumber } from '../../../lib/utils/format';

export function DailyClicksChart({ dateRange }: { dateRange: { from: string; to: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'global', dateRange],
    queryFn: () => fetchGlobalAnalytics(dateRange),
    select: (res) => res.dailyClicks,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[350px] rounded-xl" />;
  }

  return (
    <div className="bg-white rounded-xl border border-border p-5 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Traffic Trends</h3>
        <p className="text-sm text-text-secondary">Total and unique clicks over time</p>
      </div>
      
      <div className="flex-1 min-h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(val) => formatNumber(val)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-border p-3 rounded-lg shadow-lg min-w-[150px]">
                      <p className="text-sm font-medium text-text-secondary mb-3 border-b border-border pb-2">{label}</p>
                      {payload.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-text-secondary capitalize">{entry.name}</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary">
                            {formatNumber(entry.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              name="Total Clicks"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#4F46E5' }}
            />
            <Line
              type="monotone"
              dataKey="unique"
              name="Unique"
              stroke="#10B981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
