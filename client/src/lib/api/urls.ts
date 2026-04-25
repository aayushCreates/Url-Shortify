import type { ShortUrl } from '../../types/api';
import client from './client';

export interface CreateUrlPayload {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: Date | null;
  password?: string;
  maxClicks?: number;
}

export const createUrl = async (payload: CreateUrlPayload): Promise<ShortUrl> => {
  const data = {
    url: payload.originalUrl,
    customSlug: payload.customSlug,
    expiresAt: payload.expiresAt?.toISOString(),
    password: payload.password,
    maxClicks: payload.maxClicks,
  };
  const response = await client.post('/urls', data);
  return response.data.data;
};

export interface UpdateUrlPayload {
  originalUrl?: string;
  expiresAt?: Date | null;
  password?: string | null;
  maxClicks?: number | null;
}

export const updateUrl = async (slug: string, payload: UpdateUrlPayload): Promise<ShortUrl> => {
  const data = {
    url: payload.originalUrl,
    expiresAt: payload.expiresAt === null ? null : payload.expiresAt?.toISOString(),
    password: payload.password,
    maxClicks: payload.maxClicks,
  };
  // Clean undefined properties so we don't send them
  Object.keys(data).forEach(key => data[key as keyof typeof data] === undefined && delete data[key as keyof typeof data]);
  
  const response = await client.patch(`/urls/${slug}`, data);
  return response.data.data;
};

export const checkSlugAvailability = async (slug: string): Promise<{ available: boolean }> => {
  // Mock validation since backend doesn't have a dedicated endpoint yet
  await new Promise(resolve => setTimeout(resolve, 300));
  return { available: !['admin', 'api', 'login'].includes(slug) };
};

export interface FetchUrlsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const fetchUrls = async (params: FetchUrlsParams): Promise<{ urls: ShortUrl[], total: number }> => {
  const response = await client.get('/urls', { params });
  return {
    urls: response.data.data.urls,
    total: response.data.data.total,
  };
};

export const deleteUrl = async (slug: string): Promise<void> => {
  await client.delete(`/urls/${slug}`);
};
