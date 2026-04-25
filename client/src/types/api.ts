export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: string
}

export interface ShortUrl {
  id: string
  slug: string
  originalUrl: string
  shortUrl: string
  title?: string
  isActive: boolean
  totalClicks: number
  uniqueClicks: number
  createdAt: string
  expiresAt?: string
  hasPassword: boolean
  maxClicks?: number
  deletedAt?: string
}

export interface ClickStat {
  period: 'hour' | 'day' | 'week' | 'month'
  periodKey: string
  clicks: number
  uniques: number
}

export interface AnalyticsSummary {
  totalClicks: number
  uniqueClicks: number
  countries: number
  avgTime?: string
  clicksVsLastMonth: number
  uniquesVsLastMonth: number
  countriesVsLastMonth: number
}

export interface Referrer {
  source: string
  visits: number
  share: number
}

export interface CountryStat {
  country: string
  countryCode: string
  visits: number
}

export interface DeviceStat {
  device: 'desktop' | 'mobile' | 'tablet'
  count: number
  percentage: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
}
