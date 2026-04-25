import client from './client';

export interface DashboardStats {
  totalUrls: number;
  totalUrlsGrowth: number;
  totalClicks: number;
  totalClicksGrowth: number;
  uniqueVisitors: number;
  uniqueVisitorsGrowth: number;
  overallGrowth: number;
  overallGrowthVsLastMonth: number;
}

export interface DailyClick {
  date: string;
  clicks: number;
  unique: number;
}

export interface TopUrl {
  slug: string;
  originalUrl: string;
  totalClicks: number;
  uniqueClicks: number;
}

export interface DeviceStat {
  name: string;
  value: number;
  color: string;
}

export interface ReferrerStat {
  source: string;
  visits: number;
  share: number;
}

export interface LocationStat {
  country: string;
  code: string;
  visits: number;
}

export interface GlobalAnalytics {
  stats: DashboardStats;
  dailyClicks: DailyClick[];
  topUrls: TopUrl[];
  devices: DeviceStat[];
  referrers: ReferrerStat[];
  locations: LocationStat[];
}

export const fetchGlobalAnalytics = async (params?: {
  from?: string;
  to?: string;
}): Promise<GlobalAnalytics> => {
  const { data } = await client.get('/analytics/overview', { params });
  return data.data;
};

// --- Legacy alias used by Dashboard components ---
export const fetchDashboardStats = async (): Promise<{
  stats: DashboardStats;
  dailyClicks: DailyClick[];
  topUrls: TopUrl[];
}> => {
  const result = await fetchGlobalAnalytics();
  return {
    stats: result.stats,
    dailyClicks: result.dailyClicks,
    topUrls: result.topUrls,
  };
};

// --- Per-section helpers used by Analytics page components ---
export const fetchAnalyticsSummary = async (params: { from: string; to: string }) => {
  const result = await fetchGlobalAnalytics(params);
  return {
    totalClicks: result.stats.totalClicks,
    uniqueVisitors: result.stats.uniqueVisitors,
    // countries and avgTime are not yet tracked; show 0/N/A gracefully
    countries: result.locations.length,
    avgTime: 'N/A',
    clicksVsLastMonth: result.stats.totalClicksGrowth,
    uniquesVsLastMonth: result.stats.uniqueVisitorsGrowth,
    countriesVsLastMonth: 0,
    timeVsLastMonth: 0,
  };
};

export const fetchDailyClicks = async (params: { from: string; to: string }) => {
  const result = await fetchGlobalAnalytics(params);
  return result.dailyClicks;
};

export const fetchDevices = async (params: { from: string; to: string }) => {
  const result = await fetchGlobalAnalytics(params);
  return result.devices;
};

export const fetchReferrers = async (params: { from: string; to: string }) => {
  const result = await fetchGlobalAnalytics(params);
  return result.referrers;
};

export const fetchLocations = async (params: { from: string; to: string }) => {
  const result = await fetchGlobalAnalytics(params);
  return result.locations;
};
