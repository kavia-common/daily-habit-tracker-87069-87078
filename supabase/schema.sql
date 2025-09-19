-- Supabase Schema for Daily Habit Tracker
-- Run this in the Supabase SQL Editor for your project.

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- TABLE: profiles
-- Minimal profile table, keyed to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now()
);

-- TABLE: habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamp with time zone not null default now(),
  is_archived boolean not null default false,
  frequency text, -- e.g., 'daily', 'weekly', custom JSON in future
  color text,     -- hex or token string
  constraint habits_title_length check (char_length(title) > 0)
);

-- Helpful index for user scoping
create index if not exists idx_habits_user_id on public.habits(user_id);

-- TABLE: habit_logs
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  status text not null, -- e.g., 'done', 'missed', 'skipped'
  created_at timestamp with time zone not null default now(),
  constraint habit_logs_status_length check (char_length(status) > 0),
  constraint habit_logs_unique_per_day unique (habit_id, user_id, date)
);

create index if not exists idx_habit_logs_user_id on public.habit_logs(user_id);
create index if not exists idx_habit_logs_habit_id on public.habit_logs(habit_id);
create index if not exists idx_habit_logs_date on public.habit_logs(date);

-- TABLE: quotes
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  author text,
  active boolean not null default true,
  constraint quotes_text_length check (char_length(text) > 0)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.quotes enable row level security;

-- Seed optional (commented, for manual use)
-- insert into public.quotes (text, author) values
-- ('The secret of getting ahead is getting started.', 'Mark Twain'),
-- ('We are what we repeatedly do. Excellence, then, is not an act, but a habit.', 'Will Durant');
