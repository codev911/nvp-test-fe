import React, { createContext, useContext, useMemo, useState } from 'react';
import { login as loginApi } from '@/lib/mockBackend';
import type { AuthUser } from '@/types';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'example-auth';

function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { token: null, user: null };
  try {
    const parsed = JSON.parse(raw) as { token: string; user: AuthUser };
    return parsed;
  } catch (error) {
    console.error(error);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadSession().token);
  const [user, setUser] = useState<AuthUser | null>(() => loadSession().user);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token: newToken, user: profile } = await loginApi(email, password);
      setToken(newToken);
      setUser(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: profile }));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
