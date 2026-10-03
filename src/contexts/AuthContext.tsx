import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authenticate } from '../data/credentials';
import type { UserCredential } from '../data/credentials';

/* ============================================================
   AUTH CONTEXT
   ============================================================ */

interface AuthContextValue {
  user: UserCredential | null;
  login: (username: string, password: string) => string | null; // returns error message or null
  logout: () => void;
  isLead: () => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'cyberforge_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserCredential | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as UserCredential;
    } catch { /* ignore */ }
    return null;
  });

  // Persist on change
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((username: string, password: string): string | null => {
    const matched = authenticate(username, password);
    if (!matched) return 'Invalid username or password.';
    setUser(matched);
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isLead = useCallback(() => {
    return user?.role === 'lead';
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLead, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
