import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * PUBLIC_INTERFACE
 * Middleware
 * Protects application routes using Clerk. Public routes include the login page and Next.js internals.
 */
export default clerkMiddleware({
  publicRoutes: ["/", "/login", "/_next(.*)", "/api/webhooks(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api)(.*)"],
};
