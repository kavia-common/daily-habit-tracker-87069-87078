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
