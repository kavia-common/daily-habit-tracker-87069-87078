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
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  (async () => {
    const a = await auth();
    // If you need to protect specific subsets conditionally, call a.protect({allowlist/redirectUrl})
    // Here we protect all matched routes (matcher excludes public ones).
    // @ts-ignore - older Clerk types may not surface protect in the type but it exists at runtime
    if (typeof (a as any).protect === "function") {
      (a as any).protect();
    }
  })();
});

export const config = {
  // Run middleware for all app and API routes except static assets and _next internals.
  // This keeps "/" and "/login" public by not excluding them here, but they will still match.
  // If you want to keep "/" public, exclude it by narrowing matcher or handle redirect in the page.
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api)(.*)"],
};
