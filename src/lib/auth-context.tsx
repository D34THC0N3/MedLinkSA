'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role?: string, auth?: string) => Promise<void>;
  signOut: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: () => {},
  hasRole: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('medlink_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('medlink_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string, role?: string, auth?: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, auth }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await res.json();
    setUser(data.user);
    localStorage.setItem('medlink_user', JSON.stringify(data.user));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('medlink_user');
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
