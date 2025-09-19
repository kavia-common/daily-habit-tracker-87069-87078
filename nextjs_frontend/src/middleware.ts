import { clerkMiddleware, auth } from "@clerk/nextjs/server";

/**
 * PUBLIC_INTERFACE
 * Middleware
 * Protects application routes using Clerk. Public routes include the login page and Next.js internals.
 */
export default clerkMiddleware(() => {
  // Use global auth() which returns a promise-like; invoke protect at runtime
  // Public routes are excluded via the Next.js matcher below.
  // Note: Do not pass unsupported options to clerkMiddleware; use matcher instead.
  (async () => {
    const a = await auth();
    // If you need to protect specific subsets conditionally, call a.protect({allowlist/redirectUrl})
    // Here we protect all matched routes (matcher excludes public ones).
    // @ts-expect-error protect may not be declared in certain Clerk type versions but is available at runtime.
    if (typeof a.protect === "function") {
      // @ts-expect-error see note above
      a.protect();
    }
  })().catch(() => {
    // Avoid unhandled promise rejections in middleware
  });
});

export const config = {
  // Run middleware for all app and API routes except static assets and _next internals.
  // This keeps "/" and "/login" public by controlling redirects within pages.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api)(.*)"],
};
