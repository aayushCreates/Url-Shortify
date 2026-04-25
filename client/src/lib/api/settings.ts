import client from './client';
import type { User } from '../../types/api';

// Maps server user shape (role-based) to client User type
function mapUser(serverUser: { id: string; name: string; email: string; role: string }): User {
  return {
    id: serverUser.id,
    name: serverUser.name,
    email: serverUser.email,
    plan: 'free', // plan is not tracked in DB yet; default to free
    createdAt: new Date().toISOString(),
  };
}

export const updateProfile = async (data: { name: string; email: string }): Promise<User> => {
  const { data: res } = await client.patch<{ data: { user: { id: string; name: string; email: string; role: string } } }>(
    '/auth/me',
    data,
  );
  return mapUser(res.data.user);
};

// API keys and notification preferences are not yet implemented in the backend.
// These stubs allow the UI to function without errors and will be replaced when
// the corresponding backend features are added.
export const regenerateApiKey = async (): Promise<{ apiKey: string }> => {
  // TODO: implement POST /auth/api-key when backend supports it
  throw new Error('API key management is not yet available.');
};

export const updateNotifications = async (_prefs: Record<string, boolean>): Promise<{ success: boolean }> => {
  // TODO: implement PATCH /auth/notifications when backend supports it
  return { success: true };
};
