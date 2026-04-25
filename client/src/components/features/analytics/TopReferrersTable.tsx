import { useQuery } from '@tanstack/react-query';
import { fetchGlobalAnalytics } from '../../../lib/api/analytics';
import { Skeleton } from '../../ui/Skeleton';
import { formatNumber } from '../../../lib/utils/format';

export function TopReferrersTable({ dateRange }: { dateRange: { from: string; to: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'global', dateRange],
    queryFn: () => fetchGlobalAnalytics(dateRange),
    select: (res) => res.referrers,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-[300px] rounded-xl" />;
  }

  return (
    <div className="bg-white rounded-xl border border-border p-5 shadow-sm h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Top Referrers</h3>
        <p className="text-sm text-text-secondary">Where your traffic is coming from</p>
      </div>

      <div className="overflow-x-auto flex-1">
        {data.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No referrer data yet for this period.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-text-secondary uppercase">
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium text-right pr-4">Visits</th>
                <th className="pb-3 font-medium w-1/3">Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50 last:border-0 group hover:bg-bg-muted/30 transition-colors">
                  <td className="py-3 text-sm font-medium text-text-primary">{item.source}</td>
                  <td className="py-3 text-sm text-text-secondary text-right pr-4">{formatNumber(item.visits)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-primary-light rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${item.share}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-text-secondary w-8 text-right">
                        {item.share}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
