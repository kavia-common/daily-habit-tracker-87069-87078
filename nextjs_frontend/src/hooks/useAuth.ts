"use client";

import { useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

/**
 * PUBLIC_INTERFACE
 * useAuth
 * A React hook that manages Supabase authentication state on the client.
 * Provides current session, user, loading state, and common auth helpers.
 */
export function useAuth() {
  /** This is a public function. */
  // Use the singleton supabase client
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Load initial session and subscribe to auth changes
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setInitializing(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string) => {
      // Uses magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      return { error };
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? window.location.origin + "/dashboard" : undefined,
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
