'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role?: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role?: string) => Promise<void>;
  signOut: () => void;
  devLogin: () => Promise<void>;
  testLogin: (email: string) => Promise<void>;
  isDev: boolean;
}

const DEV_PASSWORD = '123456';

const TEST_ACCOUNTS: Record<string, User> = {
  patient: { id: 'test-patient', name: 'Patient Test', email: 'Patient@gmail.com', role: 'patient', verified: true },
  provider: { id: 'test-doctor', name: 'Doctor Test', email: 'Doctor@gmail.com', role: 'provider', verified: true },
  facility: { id: 'test-hospital', name: 'Hospital Test', email: 'Hospital@gmail.com', role: 'facility', verified: true },
  pharmacy: { id: 'test-pharmacy', name: 'Pharmacy Test', email: 'Pharmacy@gmail.com', role: 'pharmacy', verified: true },
  admin: { id: 'test-admin', name: 'Admin User', email: 'admin@gmail.com', role: 'admin', verified: true },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  devLogin: async () => {},
  testLogin: async () => {},
  isDev: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('medlink_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem('medlink_user');
      }
    }
    const devFlag = localStorage.getItem('medlink_dev');
    if (devFlag === 'true') setIsDev(true);
    setLoading(false);
  }, []);

  const saveUser = (u: User) => {
    setUser(u);
    localStorage.setItem('medlink_user', JSON.stringify(u));
  };

  const signIn = useCallback(async (email: string, password: string, role?: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sign in failed');
    saveUser(data.user);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string, role?: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: role || 'patient' }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    saveUser(data.user);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem('medlink_user');
    localStorage.removeItem('medlink_dev');
    setIsDev(false);
  }, []);

  const devLogin = useCallback(async () => {
    try {
      await signIn('dev@medlink.dev', DEV_PASSWORD, 'admin');
    } catch {
      try {
        await signUp('Dev User', 'dev@medlink.dev', DEV_PASSWORD, 'admin');
      } catch {
        const devUser: User = {
          id: 'dev',
          name: 'Dev User',
          email: 'dev@medlink.dev',
          role: 'admin',
          verified: true,
        };
        saveUser(devUser);
      }
    }
    localStorage.setItem('medlink_dev', 'true');
    setIsDev(true);
  }, [signIn, signUp]);

  const testLogin = useCallback(async (email: string) => {
    const roleMap: Record<string, string> = {
      'patient@gmail.com': 'patient',
      'doctor@gmail.com': 'provider',
      'hospital@gmail.com': 'facility',
      'pharmacy@gmail.com': 'pharmacy',
      'admin@gmail.com': 'admin',
    };
    const role = roleMap[email.toLowerCase()];
    if (role && TEST_ACCOUNTS[role]) {
      try {
        await signIn(email, '12345678', role);
      } catch {
        const user = { ...TEST_ACCOUNTS[role] };
        saveUser(user);
      }
    }
  }, [signIn]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, devLogin, testLogin, isDev }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
