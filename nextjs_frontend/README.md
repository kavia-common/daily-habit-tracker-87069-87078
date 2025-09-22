# HabitFlow (Next.js + Clerk + Supabase Data)

This project is a minimalist daily habit tracker built with Next.js (App Router). Authentication is powered by Clerk, while data persistence currently uses Supabase tables. It includes authentication, habit management, streak tracking, and a clean UI.

## Getting Started

### 1) Prerequisites
- Node.js 18+
- A Clerk application (Publishable + Secret keys)
- A Supabase project for data (optional if you later migrate away)
- Environment variables configured in a `.env.local` file

Required env vars:
```
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>

# Supabase (data only)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_KEY=<your-supabase-anon-key>
```

### 2) Install and run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

### 3) Configure Supabase database schema, RLS, and seed data (if using Supabase for data)
Use the Supabase SQL Editor to apply the schema, policies, and seed data found in the repository:
- ../../supabase/schema.sql
- ../../supabase/policies.sql
- ../../supabase/seed.sql (optional demo data)

### 4) Authentication (Clerk)
The app uses Clerk for all auth:
- Provider: `ClerkProvider` in `src/app/layout.tsx`
- Middleware protection: `src/middleware.ts`
- Login page: `src/app/login/page.tsx` (modern, car-themed, emoji-rich UI, renders Clerk `<SignIn />`)
- Navbar: `src/components/Navbar.tsx` displays `UserButton` and `SignOutButton`
- Route protection: app group layout in `src/app/(app)/layout.tsx` uses `SignedIn`/`SignedOut`

Clerk route handlers:
- `src/app/api/auth/[...clerk]/route.ts`

Environment:
- Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. On Vercel, add these in Project Settings > Environment Variables.

### 5) Data access (Supabase)
While authentication is now fully handled by Clerk, data fetching and mutations still use Supabase in:
- `src/lib/dataClient.ts`

If you want to migrate away from Supabase for data, replace the methods in `dataClient.ts` and remove Supabase deps/envs.

### 6) Project scripts
- `npm run dev` start development server
- `npm run build` create production build
- `npm run start` run production build locally

## Notes
- Theme: Minimalist “Ocean Professional”
- The login screen includes a modern card, playful car emoji visuals, and simple chart placeholders for an engaging but clean experience.
- When deploying, set the Clerk keys and any Supabase variables (if still used for data).

## Troubleshooting

### VS Code preview shows instead of the app
Some environments route the preview URL to `/preview.html` (e.g., `https://<host>:3000/preview.html`), which is a VS Code web preview page. This is not the Next.js app.

Fix:
- Use the app root instead: `http://localhost:3000/` (or your container URL ending with `/`).
- We added a route at `/preview.html` that redirects to `/` so even if the preview points there, you’ll land in HabitFlow.

If you still see the VS Code interface, ensure the dev server is running (`npm run dev`) and that you’re visiting `/` or `/login` and not a static `/preview.html` page.

## Optional improvements
- Migrate data from Supabase to your preferred backend; remove `@supabase/*` packages and envs when done.
- Add analytics (e.g., Vercel Analytics, PostHog).
- Add caching with SWR or React Query for habit lists/logs.
- Harden middleware public routes to suit your content needs.

```diff
Auth Migration Summary:
- Supabase auth -> Clerk
- Root provider -> ClerkProvider
- Route guards -> SignedIn/SignedOut + middleware
- Login page -> Custom UI + <SignIn />
- Navbar -> UserButton + SignOutButton
```
