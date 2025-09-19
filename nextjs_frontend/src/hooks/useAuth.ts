"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";

/**
 * PUBLIC_INTERFACE
 * useAuth
 * A React hook that manages Supabase authentication state on the client.
 * Provides current session, user, loading state, and common auth helpers.
 */
export function useAuth() {
  /** This is a public function. */
  // Memoize the client getter to avoid re-subscribing unnecessarily
  const supabase = useMemo(() => {
    try {
      return getSupabaseClient();
    } catch {
      // In environments without env vars (e.g., preview builds), keep a null client
      return null;
    }
  }, []);

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Load initial session and subscribe to auth changes
  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }

    let isMounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setInitializing(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string) => {
      if (!supabase) {
        return { error: new Error("Supabase client is not configured.") };
      }
      // Uses magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      return { error };
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return { error: new Error("Supabase client is not configured.") };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? window.location.origin + "/dashboard"
            : undefined,
      },
    });
    return { error };
  }, [supabase]);

  return {
    session,
    user,
    initializing,
    isAuthenticated: !!user,
    signOut,
    signInWithEmail,
    signInWithGoogle,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
