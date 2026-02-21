import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export type AuthUser = {
  id: string;
  email: string | null;
};

type Ctx = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (identifier: string, password: string) => Promise<void>;
  signUp: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

function normalizeIdentifier(input: string): { email: string; username: string | null } {
  const trimmed = input.trim();
  if (!trimmed) return { email: '', username: null };
  if (trimmed.includes('@')) return { email: trimmed, username: null };
  return { email: `${trimmed}@typeteawthai.local`, username: trimmed };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    async function init() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const u = data.session?.user;
      setUser(
        u
          ? { id: u.id, email: u.email ?? null }
          : null
      );

      setLoading(false);

      const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
        const u2 = session?.user;
        setUser(
          u2
            ? { id: u2.id, email: u2.email ?? null }
            : null
        );

      });
      unsub = () => sub.subscription.unsubscribe();
    }

    init();
    return () => {
      unsub?.();
    };
  }, []);

  async function signIn(identifier: string, password: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { email } = normalizeIdentifier(identifier);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(identifier: string, password: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { email, username } = normalizeIdentifier(identifier);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Optional: store username in profiles (if table exists)
    const created = data.user;
    if (created?.id && username) {
      try {
        await supabase.from('profiles').insert({ id: created.id, username });
      } catch {
        // ignore if profiles table/RLS not ready
      }
    }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  const value = useMemo<Ctx>(() => ({ user, loading, signIn, signUp, signOut }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
