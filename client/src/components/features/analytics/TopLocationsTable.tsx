import { useQuery } from '@tanstack/react-query';
import { fetchGlobalAnalytics } from '../../../lib/api/analytics';
import { Skeleton } from '../../ui/Skeleton';
import { formatNumber } from '../../../lib/utils/format';

export function TopLocationsTable({ dateRange }: { dateRange: { from: string; to: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'global', dateRange],
    queryFn: () => fetchGlobalAnalytics(dateRange),
    select: (res) => res.locations,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[300px] rounded-xl" />;
  }

  const getFlagEmoji = (countryCode: string) => {
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🌍';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-5 shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Top Locations</h3>
        <p className="text-sm text-text-secondary">Global distribution of clicks</p>
      </div>

      <div className="overflow-x-auto flex-1">
        {data.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No location data yet for this period.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-text-secondary uppercase">
                <th className="pb-3 font-medium">Country</th>
                <th className="pb-3 font-medium text-right">Visits</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50 last:border-0 group hover:bg-bg-muted/30 transition-colors">
                  <td className="py-3 text-sm font-medium text-text-primary flex items-center gap-2">
                    <span className="text-lg leading-none" role="img" aria-label={item.country}>
                      {getFlagEmoji(item.code)}
                    </span>
                    {item.country}
                  </td>
                  <td className="py-3 text-sm text-text-secondary text-right">{formatNumber(item.visits)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
