import { NextResponse } from "next/server";

/**
 * PUBLIC_INTERFACE
 * GET /preview.html
 * This route exists to handle environments that attempt to load `/preview.html` (e.g., VS Code web preview).
 * We redirect to the app root which in turn redirects users to /login or /dashboard based on authentication.
 *
 * Returns:
 *  - 302 Redirect to "/"
 */
export async function GET() {
  // Redirect to app root; the root page handles redirecting to /login or /dashboard.
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
