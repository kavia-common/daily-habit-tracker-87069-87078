"use client";

import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";

/**
 * PUBLIC_INTERFACE
 * useAuth
 * A thin wrapper around Clerk hooks to expose a familiar shape used by the app.
 */
export function useAuth() {
  /** This is a public function. */
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerkAuth();

  return {
    session: null, // not used in current app
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? undefined,
        }
      : null,
    initializing: !isLoaded,
    isAuthenticated: !!isSignedIn,
    signOut: async () => {
      await signOut();
    },
    // These are no-ops now; SignIn UI is handled by Clerk <SignIn />
    signInWithEmail: async () => ({ error: null }),
    signInWithGoogle: async () => ({ error: null }),
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
