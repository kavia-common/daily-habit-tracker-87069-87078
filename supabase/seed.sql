-- Supabase Seed Data for Daily Habit Tracker
-- Usage:
-- 1) In Supabase SQL Editor, set a test user UUID to bind demo data to:
--    replace the value for test_user_id below with an existing auth.users id from your project.
-- 2) Run this file after schema.sql and policies.sql.
-- 3) You can safely re-run: inserts are guarded to avoid duplicates.

-- ========= CONFIGURE THIS BEFORE RUNNING =========
-- Replace this with a valid UUID from your project's auth.users table.
-- You can find one by inviting a user or registering via the app, then copy their id.
do $$
begin
  if not exists (select 1 from pg_settings where name = 'app.test_user_id') then
    perform set_config('app.test_user_id', '00000000-0000-0000-0000-000000000000', false);
  end if;
end$$;

-- Helper function to fetch configured test user id
create or replace function app.get_test_user_id() returns uuid
language sql
stable
as $$
  select (select setting::uuid from pg_settings where name = 'app.test_user_id');
$$;

-- Ensure a profile row exists for test user (no-op if already present)
insert into public.profiles (id)
select app.get_test_user_id()
where app.get_test_user_id() is not null
  and app.get_test_user_id() <> '00000000-0000-0000-0000-000000000000'::uuid
  and not exists (
    select 1 from public.profiles p where p.id = app.get_test_user_id()
  );

-- Seed quotes (active = true). Guard to avoid duplicates by text.
insert into public.quotes (text, author, active)
select q.text, q.author, true
from (values
  ('The secret of getting ahead is getting started.', 'Mark Twain'),
  ('We are what we repeatedly do. Excellence, then, is not an act, but a habit.', 'Will Durant'),
  ('Success is the sum of small efforts, repeated day in and day out.', 'Robert Collier'),
  ('Motivation is what gets you started. Habit is what keeps you going.', 'Jim Ryun'),
  ('Either you run the day or the day runs you.', 'Jim Rohn')
) as q(text, author)
where not exists (
  select 1 from public.quotes x where x.text = q.text
);

-- Seed demo habits for the configured test user
-- Only proceed if test_user_id is set to a real UUID.
do $setup$
declare
  u uuid := (select app.get_test_user_id());
  h_drink uuid;
  h_read uuid;
  h_exer uuid;
begin
  if u is null or u = '00000000-0000-0000-0000-000000000000'::uuid then
    raise notice 'Seed: test_user_id not configured; skipping user-bound demo habits.';
    return;
  end if;

  -- Habit 1: Drink Water
  if not exists (select 1 from public.habits where user_id = u and title = 'Drink Water') then
    insert into public.habits (user_id, title, description, frequency, color)
    values (u, 'Drink Water', 'Drink 8 glasses of water', 'daily', '#10B981')
    returning id into h_drink;
  else
    select id into h_drink from public.habits where user_id = u and title = 'Drink Water' limit 1;
  end if;

  -- Habit 2: Read 20 Minutes
  if not exists (select 1 from public.habits where user_id = u and title = 'Read 20 Minutes') then
    insert into public.habits (user_id, title, description, frequency, color)
    values (u, 'Read 20 Minutes', 'Read non-fiction or fiction for 20 minutes', 'daily', '#374151')
    returning id into h_read;
  else
    select id into h_read from public.habits where user_id = u and title = 'Read 20 Minutes' limit 1;
  end if;

  -- Habit 3: Exercise
  if not exists (select 1 from public.habits where user_id = u and title = 'Exercise') then
    insert into public.habits (user_id, title, description, frequency, color)
    values (u, 'Exercise', 'Light workout or walk', 'daily', '#EF4444')
    returning id into h_exer;
  else
    select id into h_exer from public.habits where user_id = u and title = 'Exercise' limit 1;
  end if;

  -- Seed recent logs for last 5 days for the first two habits
  -- Use 'done' and 'missed' alternating pattern as sample data.
  if h_drink is not null then
    insert into public.habit_logs (habit_id, user_id, date, status)
    select h_drink, u, d::date, case when (row_number() over (order by d)) % 2 = 1 then 'done' else 'missed' end
    from generate_series(current_date - interval '4 days', current_date, interval '1 day') as d
    on conflict (habit_id, user_id, date) do nothing;
  end if;

  if h_read is not null then
    insert into public.habit_logs (habit_id, user_id, date, status)
    select h_read, u, d::date, case when (row_number() over (order by d)) % 3 = 0 then 'missed' else 'done' end
    from generate_series(current_date - interval '4 days', current_date, interval '1 day') as d
    on conflict (habit_id, user_id, date) do nothing;
  end if;

  -- Optionally seed a couple logs for Exercise
  if h_exer is not null then
    insert into public.habit_logs (habit_id, user_id, date, status)
    values
      (h_exer, u, current_date - 2, 'done'),
      (h_exer, u, current_date - 1, 'skipped')
    on conflict (habit_id, user_id, date) do nothing;
  end if;

  raise notice 'Seed: demo habits and logs created for user %', u;
end
$setup$;

-- Notes:
-- - To set the test user id for this session in Supabase SQL editor, run:
--   select set_config('app.test_user_id', '<your-auth-user-uuid>', false);
-- - Then execute this seed.sql.
-- - You can re-run without creating duplicates due to guards and constraints.
