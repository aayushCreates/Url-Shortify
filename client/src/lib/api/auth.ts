import client from "./client";
import type { User } from "../../types/api";

export const getMe = async () => {
  const { data } = await client.get<{ data: { user: User } }>("/auth/me");
  return data.data;
};

export const login = async (email: string, password: string) => {
  const { data } = await client.post<{
    data: { user: User; accessToken: string };
  }>("/auth/login", { email, password });
  return data.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const { data } = await client.post<{
    data: { user: User; accessToken: string };
  }>("/auth/register", { name, email, password });
  return data.data;
};

export const logout = async () => {
  await client.post("/auth/logout");
};

export const refresh = async () => {
  const { data } = await client.post<{
    data: { accessToken: string; refreshToken: string; user: User };
  }>("/auth/refresh");
  return data;
};
