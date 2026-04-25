import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchDashboardStats } from '../../../lib/api/analytics';
import { Skeleton } from '../../ui/Skeleton';
import { formatNumber } from '../../../lib/utils/format';

export function TopUrlsChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[300px] rounded-xl" />;
  }

  return (
    <div className="bg-white rounded-xl border border-border p-5 shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Top performing URLs</h3>
        <p className="text-sm text-text-secondary">Your most clicked links</p>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.topUrls} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="slug"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#334155', fontWeight: 500 }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: '#F1F5F9' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-border p-3 rounded-lg shadow-lg">
                      <p className="text-sm font-medium text-text-secondary mb-1">/{data.slug}</p>
                      <p className="text-lg font-bold text-primary">
                        {formatNumber(data.clicks)} clicks
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="clicks"
              fill="#4F46E5"
              radius={[0, 4, 4, 0]}
              barSize={24}
              label={{
                position: 'right',
                fill: '#64748B',
                fontSize: 12,
                formatter: (val: any) => formatNumber(Number(val)),
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
