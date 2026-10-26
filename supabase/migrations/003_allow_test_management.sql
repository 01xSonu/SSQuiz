-- ══════════════════════════════════════════════════════════════════════
-- SSQuiz — Fix: "new row violates row-level security policy for table 'tests'"
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════

-- 1. TESTS Table Policies (Allow authenticated users/admin to insert, update, delete)
DROP POLICY IF EXISTS "tests_insert_policy" ON public.tests;
DROP POLICY IF EXISTS "tests_update_policy" ON public.tests;
DROP POLICY IF EXISTS "tests_delete_policy" ON public.tests;
DROP POLICY IF EXISTS "tests_insert_authenticated" ON public.tests;

CREATE POLICY "tests_insert_policy" ON public.tests
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "tests_update_policy" ON public.tests
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "tests_delete_policy" ON public.tests
  FOR DELETE TO authenticated
  USING (true);

-- 2. QUESTIONS Table Policies (Allow authenticated users/admin to insert, update, delete)
DROP POLICY IF EXISTS "questions_insert_policy" ON public.questions;
DROP POLICY IF EXISTS "questions_update_policy" ON public.questions;
DROP POLICY IF EXISTS "questions_delete_policy" ON public.questions;
DROP POLICY IF EXISTS "questions_insert_authenticated" ON public.questions;

CREATE POLICY "questions_insert_policy" ON public.questions
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "questions_update_policy" ON public.questions
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "questions_delete_policy" ON public.questions
  FOR DELETE TO authenticated
  USING (true);
