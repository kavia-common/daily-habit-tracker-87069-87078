-- Supabase RLS Policies for Daily Habit Tracker
-- Run this in the Supabase SQL Editor after running schema.sql.

-- Helper notes:
-- auth.uid() returns the current authenticated user's UUID.
-- We enforce that users can only see and mutate their own data for user-scoped tables.

-- PROFILES
-- Only the user can view or update their own profile row.
drop policy if exists "Profiles: user can read own profile" on public.profiles;
create policy "Profiles: user can read own profile"
  on public.profiles for select
  using (id = auth.uid());

drop policy if exists "Profiles: user can insert self row" on public.profiles;
create policy "Profiles: user can insert self row"
  on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists "Profiles: user can update own profile" on public.profiles;
create policy "Profiles: user can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Optionally, allow delete by owner (commented for safety)
-- drop policy if exists "Profiles: user can delete own profile" on public.profiles;
-- create policy "Profiles: user can delete own profile"
--   on public.profiles for delete
--   using (id = auth.uid());

-- HABITS
-- Users can only access and modify their own rows (user_id = auth.uid())
drop policy if exists "Habits: read own" on public.habits;
create policy "Habits: read own"
  on public.habits for select
  using (user_id = auth.uid());

drop policy if exists "Habits: insert own" on public.habits;
create policy "Habits: insert own"
  on public.habits for insert
  with check (user_id = auth.uid());

drop policy if exists "Habits: update own" on public.habits;
create policy "Habits: update own"
  on public.habits for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Habits: delete own" on public.habits;
create policy "Habits: delete own"
  on public.habits for delete
  using (user_id = auth.uid());

-- HABIT_LOGS
-- Users can only access and modify their own rows (user_id = auth.uid())
drop policy if exists "HabitLogs: read own" on public.habit_logs;
create policy "HabitLogs: read own"
  on public.habit_logs for select
  using (user_id = auth.uid());

drop policy if exists "HabitLogs: insert own" on public.habit_logs;
create policy "HabitLogs: insert own"
  on public.habit_logs for insert
  with check (user_id = auth.uid());

drop policy if exists "HabitLogs: update own" on public.habit_logs;
create policy "HabitLogs: update own"
  on public.habit_logs for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "HabitLogs: delete own" on public.habit_logs;
create policy "HabitLogs: delete own"
  on public.habit_logs for delete
  using (user_id = auth.uid());

-- QUOTES
-- Allow all authenticated users to read active quotes; no inserts/updates/deletes by clients.
drop policy if exists "Quotes: read active for all" on public.quotes;
create policy "Quotes: read active for all"
  on public.quotes for select
  to authenticated
  using (active is true);

-- If you want public (anon) read, swap `to authenticated` with `to anon, authenticated`.
-- Keep write operations restricted to service role only (no explicit policies).
