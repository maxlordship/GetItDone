-- GetItDone GTD Schema
-- Run this in the Supabase SQL editor

-- Areas of responsibility
create table public.areas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default '#6366f1',
  created_at timestamptz default now() not null
);

-- Projects
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  area_id uuid references public.areas(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'completed', 'someday')),
  due_date date,
  created_at timestamptz default now() not null
);

-- Actions (next_action, waiting_for, someday_maybe, scheduled)
create table public.actions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  area_id uuid references public.areas(id) on delete set null,
  title text not null,
  notes text,
  type text not null check (type in ('next_action', 'waiting_for', 'someday_maybe', 'scheduled')),
  context text,
  scheduled_at timestamptz,
  delegated_to text,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null
);

-- Inbox (quick capture)
create table public.inbox (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  notes text,
  created_at timestamptz default now() not null
);

-- Row Level Security
alter table public.areas enable row level security;
alter table public.projects enable row level security;
alter table public.actions enable row level security;
alter table public.inbox enable row level security;

-- RLS policies: users can only access their own data
create policy "Users can manage their own areas"
  on public.areas for all using (auth.uid() = user_id);

create policy "Users can manage their own projects"
  on public.projects for all using (auth.uid() = user_id);

create policy "Users can manage their own actions"
  on public.actions for all using (auth.uid() = user_id);

create policy "Users can manage their own inbox"
  on public.inbox for all using (auth.uid() = user_id);

-- Indexes for common queries
create index actions_user_type_idx on public.actions(user_id, type) where not completed;
create index actions_user_scheduled_idx on public.actions(user_id, scheduled_at) where type = 'scheduled' and not completed;
create index actions_project_idx on public.actions(project_id) where not completed;
create index inbox_user_idx on public.inbox(user_id, created_at desc);
