-- ══════════════════════════════════════════════════════════════════════
-- SSQuiz — Migration 005: Allow Admin to View All Student Submissions & Scores
-- Run this script in your Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- ══════════════════════════════════════════════════════════════════════

-- 1. Allow Admin to view all student profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;

CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid() 
    OR 
    (auth.jwt()->>'email' = 'sonukr99770@gmail.com')
  );

-- 2. Allow Admin to view all student test submissions and scores
DROP POLICY IF EXISTS "submissions_select_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_select_admin" ON public.submissions;

CREATE POLICY "submissions_select_admin" ON public.submissions
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() 
    OR 
    (auth.jwt()->>'email' = 'sonukr99770@gmail.com')
  );
