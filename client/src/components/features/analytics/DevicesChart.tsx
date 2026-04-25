import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchGlobalAnalytics } from '../../../lib/api/analytics';
import { Skeleton } from '../../ui/Skeleton';
import { formatNumber } from '../../../lib/utils/format';

export function DevicesChart({ dateRange }: { dateRange: { from: string; to: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'global', dateRange],
    queryFn: () => fetchGlobalAnalytics(dateRange),
    select: (res) => res.devices,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[350px] rounded-xl" />;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl border border-border p-5 shadow-sm h-full flex flex-col">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-text-primary">Devices</h3>
        <p className="text-sm text-text-secondary">Traffic by device type</p>
      </div>

      <div className="flex-1 min-h-[220px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white border border-border p-3 rounded-lg shadow-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium text-text-secondary">{item.name}</span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {formatNumber(item.value)} clicks
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Total Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-text-primary">{formatNumber(total)}</span>
          <span className="text-xs text-text-secondary">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        {data.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-text-secondary">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
