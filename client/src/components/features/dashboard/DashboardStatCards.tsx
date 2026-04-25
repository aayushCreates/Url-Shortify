import { Link2, MousePointer, Users, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../../../lib/api/analytics';
import { Skeleton } from '../../ui/Skeleton';
import { formatNumber } from '../../../lib/utils/format';
import { cn } from '../../../lib/utils/cn';

export function DashboardStatCards() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
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
      title: 'Total URLs',
      value: data.stats.totalUrls,
      growth: data.stats.totalUrlsGrowth,
      icon: Link2,
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
    {
      title: 'Total Clicks',
      value: data.stats.totalClicks,
      growth: data.stats.totalClicksGrowth,
      icon: MousePointer,
      color: 'text-success',
      bg: 'bg-success-bg',
    },
    {
      title: 'Unique Visitors',
      value: data.stats.uniqueVisitors,
      growth: data.stats.uniqueVisitorsGrowth,
      icon: Users,
      color: 'text-warning',
      bg: 'bg-warning-bg',
    },
    {
      title: 'Growth',
      value: `${data.stats.overallGrowth > 0 ? '+' : ''}${data.stats.overallGrowth}%`,
      growth: data.stats.overallGrowthVsLastMonth,
      icon: data.stats.overallGrowth > 0 ? TrendingUp : TrendingDown,
      color: data.stats.overallGrowth > 0 ? 'text-primary' : 'text-danger',
      bg: data.stats.overallGrowth > 0 ? 'bg-primary-light' : 'bg-danger-bg',
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
              <span className="text-text-muted">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
