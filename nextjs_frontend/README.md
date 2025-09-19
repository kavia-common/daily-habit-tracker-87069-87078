This is a Next.js 14 app (App Router) integrated with Supabase for authentication and database.

## Getting Started

### 1) Prerequisites
- Node.js 18+
- A Supabase project
- Environment variables configured in a `.env.local` file

Required env vars (must match Supabase project settings):
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_KEY=<your-supabase-anon-key>
```

The app uses these variables in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`. If they are missing, the client will throw a runtime error with a helpful message.

### 2) Install and run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

### 3) Configure Supabase database schema, RLS, and seed data
Use the Supabase SQL Editor in your project to apply the schema, policies, and seed data found in the repository:

- Open Supabase web console > SQL Editor
- Paste and run the contents of:
  - ../../supabase/schema.sql
  - ../../supabase/policies.sql
  - ../../supabase/seed.sql (optional but recommended for demo)

This creates the following tables and policies:
- profiles (id references auth.users, created_at)
- habits (per-user data with title, description, is_archived, frequency, color)
- habit_logs (per-user logs keyed by habit, date, and status)
- quotes (publicly readable active quotes)
Row Level Security (RLS) is enabled so users can only read/write their own rows in habits and habit_logs. Profiles are self-scoped. Quotes are readable to authenticated users by default.

Seeding instructions:
- Ensure you have at least one user in auth.users (register via the app or invite a user).
- In the SQL Editor, set the test user id for this session:
  select set_config('app.test_user_id', '<your-auth-user-uuid>', false);
- Run ../../supabase/seed.sql. You can safely re-run it; it guards against duplicate inserts.

### 4) Authentication
The app supports email/password and Google OAuth via Supabase. Ensure the providers are enabled in your Supabase Auth settings. Auth state and route protection are implemented in:
- src/hooks/useAuth.ts
- src/app/(app)/layout.tsx

### 5) Project scripts
- `npm run dev` start development server.
- `npm run build` create production build.
- `npm run start` run production build locally.

## Notes
- The app uses a minimalist “Ocean Professional” theme. You can customize UI in `src/app/(app)` pages and `src/components/Navbar.tsx`.
- When deploying, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY in your hosting provider’s environment settings.

## Optional improvements

### Image optimization
Use Next.js Image component (next/image) for any non-icon imagery to get built‑in resizing, lazy loading, and optimized formats. Configure allowed domains in next.config.ts if you load remote images.

Example:
```tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative h-40 w-full">
      <Image
        src="/hero.jpg"          // or remote URL added to next.config.ts images.domains
        alt="Motivational"
        fill
        priority
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, 1200px"
      />
    </div>
  );
}
```

If you need external images, add their domains:
```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
};
export default nextConfig;
```

### Data fetching, SWR, and caching
For client‑side lists like habits and logs, SWR provides caching, revalidation, focus/interval refresh, and optimistic UI.

Basic setup:
```bash
npm install swr
```

Example with Supabase:
```tsx
'use client';

import useSWR from 'swr';
import { createClient } from '@/src/lib/supabase/client';

const supabase = createClient();
const fetcher = async () => {
  const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export default function HabitsList() {
  const { data, error, isLoading, mutate } = useSWR('habits:list', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 1000,
  });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Failed to load</div>;

  return (
    <ul>
      {data?.map((h) => (
        <li key={h.id}>{h.title}</li>
      ))}
    </ul>
  );
}
```

Recommendations:
- Use stable SWR keys (e.g., 'habits:list' and 'habit_logs:by-habit:{id}').
- After inserts/updates, call mutate() to revalidate or pass optimistic data to keep UI snappy.
- Prefer server components for static/slow‑changing content and client components with SWR for frequently changing user data.
- Consider using select columns rather than * to reduce payload size.

### Analytics and performance
- Enable Web Vitals: Next.js exposes core metrics in the reportWebVitals export.
- Use an analytics provider. Vercel Analytics is zero‑config on Vercel; alternatives include Google Analytics, PostHog, or Plausible.
- Monitor bundle size with next build output and reduce large dependencies where possible.
- Use React Profiler and Lighthouse for runtime and UX checks.
- Leverage dynamic imports for splitting rarely used components (e.g., modals).

Examples:
```ts
// app/reportWebVitals.ts
export function reportWebVitals(metric: any) {
  // Send to your analytics endpoint
  // e.g. fetch('/analytics', { method: 'POST', body: JSON.stringify(metric) })
}
```

```tsx
// Example dynamic import for a heavy component
import dynamic from 'next/dynamic';
const AddHabitModal = dynamic(() => import('@/src/components/AddHabitModal'), { ssr: false });
```

If using Vercel Analytics:
- Install: `npm i @vercel/analytics`
- Add: `import { Analytics } from '@vercel/analytics/react'` in `src/app/layout.tsx` and include `<Analytics />` in the returned JSX.

General tips:
- Keep Tailwind classes minimal and reuse components.
- Audit images to prefer vector or small raster assets.
- Cache Supabase queries via SWR and minimize re-queries on navigation.
