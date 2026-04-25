import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { setAccessToken, clearAccessToken } from "../lib/api/client";
import * as authApi from "../lib/api/auth";
import type { User } from "../types/api";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On every page load the in-memory access token is gone.
  // Restore the session by exchanging the httpOnly refresh-token cookie
  // for a fresh access token, then load the user profile.
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await authApi.refresh();
        setAccessToken(data.accessToken);
        const { user } = await authApi.getMe();
        setUser(user);
      } catch {
        // Refresh token missing or expired — user must log in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);


  const login = async (email: string, password: string) => {
    const { user, accessToken } = await authApi.login(email, password);
    setAccessToken(accessToken);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user, accessToken } = await authApi.register(name, email, password);
    setAccessToken(accessToken);
    setUser(user);
  };

  const logout = async () => {
    await authApi.logout();
    clearAccessToken();
    setUser(null);
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    const { user } = await authApi.getMe();
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
