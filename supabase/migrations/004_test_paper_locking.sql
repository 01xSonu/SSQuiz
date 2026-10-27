-- ══════════════════════════════════════════════════════════════════════
-- SSQuiz — Migration 004: Anti-Cheating Test Paper Locking System
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ══════════════════════════════════════════════════════════════════════

-- 1. Add is_locked column to tests table
-- Defaults to TRUE so that any newly created test paper is automatically locked for students
ALTER TABLE public.tests
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT TRUE;

-- 2. Mark any pre-existing tests as unlocked so existing practice quizzes remain accessible
UPDATE public.tests
SET is_locked = FALSE
WHERE is_locked IS NULL;

-- 3. Create index for fast lookups on lock status
CREATE INDEX IF NOT EXISTS idx_tests_is_locked ON public.tests(is_locked);

-- 4. Secure questions table with anti-cheating Row Level Security (RLS)
-- Non-admin users cannot query questions or answers if a test is locked
DROP POLICY IF EXISTS "questions_select_published" ON public.questions;

CREATE POLICY "questions_select_published" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tests
      WHERE tests.id = questions.test_id
        AND tests.is_published = true
        AND (tests.is_locked = false OR tests.is_locked IS NULL)
    )
    OR
    (auth.jwt()->>'email' = 'sonukr99770@gmail.com')
  );

-- 5. Ensure authenticated users / admin can update test lock state
DROP POLICY IF EXISTS "tests_update_policy" ON public.tests;
CREATE POLICY "tests_update_policy" ON public.tests
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
