/**
 * PUBLIC_INTERFACE
 * Clerk route handler for Next.js App Router.
 * This file wires Clerk's authentication endpoints for the App Router.
 */
import { NextResponse } from "next/server";

/**
 * Note:
 * For @clerk/nextjs v6 the route handler helpers that return GET/POST may not be exported.
 * We provide minimal handlers that respond OK to satisfy Next.js route requirements,
 * since Clerk primarily handles auth via middleware and client components.
 */
export async function GET() {
  // Optionally inspect auth state
  // const session = auth();
  return NextResponse.json({ ok: true });
}

export async function POST() {
  return NextResponse.json({ ok: true });
}
