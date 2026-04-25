import { MousePointer, Users, Globe, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchGlobalAnalytics } from '../../../lib/api/analytics';
import { Skeleton } from '../../ui/Skeleton';
import { formatNumber } from '../../../lib/utils/format';
import { cn } from '../../../lib/utils/cn';

export function AnalyticsStatCards({ dateRange }: { dateRange: { from: string; to: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'global', dateRange],
    queryFn: () => fetchGlobalAnalytics(dateRange),
    select: (res) => ({
      totalClicks: res.stats.totalClicks,
      uniqueVisitors: res.stats.uniqueVisitors,
      countries: res.locations.length,
      avgTime: 'N/A',
      clicksVsLastMonth: res.stats.totalClicksGrowth,
      uniquesVsLastMonth: res.stats.uniqueVisitorsGrowth,
      countriesVsLastMonth: 0,
      timeVsLastMonth: 0,
    }),
  });

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Clicks',
      value: data.totalClicks,
      growth: data.clicksVsLastMonth,
      icon: MousePointer,
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
    {
      title: 'Unique Visitors',
      value: data.uniqueVisitors,
      growth: data.uniquesVsLastMonth,
      icon: Users,
      color: 'text-success',
      bg: 'bg-success-bg',
    },
    {
      title: 'Countries',
      value: data.countries,
      growth: data.countriesVsLastMonth,
      icon: Globe,
      color: 'text-warning',
      bg: 'bg-warning-bg',
    },
    {
      title: 'Avg. Time',
      value: data.avgTime,
      growth: data.timeVsLastMonth,
      icon: Clock,
      color: 'text-danger',
      bg: 'bg-danger-bg',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const isPositive = card.growth >= 0;
        return (
          <div
            key={i}
            className="bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                {card.title}
              </h3>
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", card.bg)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-text-primary">
              {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "flex items-center font-medium",
                  isPositive ? "text-success" : "text-danger"
                )}
              >
                {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                {Math.abs(card.growth)}%
              </span>
              <span className="text-text-muted">vs last period</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
