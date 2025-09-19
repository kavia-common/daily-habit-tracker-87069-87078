import { clerkMiddleware, auth } from "@clerk/nextjs/server";

/**
 * PUBLIC_INTERFACE
 * Middleware
 * Protects application routes using Clerk. Public routes include the login page and Next.js internals.
 */
export default clerkMiddleware((authCtx) => {
  const { protect } = auth(authCtx);

  // Protect all app routes except explicit public ones.
  // Public: home (redirects), login, Next internals and static files are excluded by config matcher.
  protect();
}, {
  // Use routeMatcher to specify which routes this middleware should run on (protected).
  // We do NOT include "/" or "/login" so those remain public.
  routeMatcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api)(.*)"],
});

export const config = {
  // Next.js-level matcher to run middleware for all routes except static assets and _next
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api)(.*)"],
};
