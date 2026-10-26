-- SSQuiz Database Schema v1.0
-- Run this in Supabase SQL Editor

-- ─── PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username          TEXT UNIQUE,
  full_name         TEXT,
  avatar_url        TEXT,
  target_exam       TEXT,
  subject           TEXT,
  academic_year     TEXT,
  daily_goal_hours  INTEGER DEFAULT 4,
  xp                INTEGER DEFAULT 0,
  level             INTEGER DEFAULT 1,
  streak            INTEGER DEFAULT 0,
  last_active       DATE,
  theme             TEXT DEFAULT 'light',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (id = auth.uid());

-- ─── SUBJECTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  icon       TEXT DEFAULT '📚',
  color      TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects_select_all" ON subjects FOR SELECT USING (true);

-- ─── TESTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id   UUID REFERENCES subjects(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  difficulty   TEXT CHECK (difficulty IN ('easy','medium','hard')) DEFAULT 'medium',
  mode         TEXT CHECK (mode IN ('timed','instant','mock')) DEFAULT 'timed',
  duration_min INTEGER DEFAULT 30,
  total_marks  INTEGER DEFAULT 100,
  topic        TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tests_select_all" ON tests FOR SELECT USING (is_published = true);
CREATE POLICY "tests_insert_authenticated" ON tests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tests_delete_authenticated" ON tests FOR DELETE USING (auth.uid() IS NOT NULL);

-- ─── QUESTIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id     UUID REFERENCES tests(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  options     JSONB NOT NULL,
  correct_ans TEXT NOT NULL,
  explanation TEXT,
  marks       INTEGER DEFAULT 1,
  order_num   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_select_published" ON questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM tests WHERE tests.id = questions.test_id AND tests.is_published = true)
);
CREATE POLICY "questions_insert_authenticated" ON questions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "questions_delete_authenticated" ON questions FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE INDEX idx_questions_test ON questions(test_id);

-- ─── TASKS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT CHECK (priority IN ('high','medium','low')) DEFAULT 'medium',
  category    TEXT CHECK (category IN ('revision','practice','lecture','other')) DEFAULT 'other',
  is_complete BOOLEAN DEFAULT FALSE,
  due_date    DATE DEFAULT CURRENT_DATE,
  rollover    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_select_own" ON tasks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "tasks_insert_own" ON tasks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "tasks_update_own" ON tasks FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "tasks_delete_own" ON tasks FOR DELETE USING (user_id = auth.uid());

CREATE INDEX idx_tasks_user_date ON tasks(user_id, due_date);

-- ─── SUBMISSIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  test_id      UUID REFERENCES tests(id) ON DELETE CASCADE,
  answers      JSONB NOT NULL DEFAULT '{}',
  score        INTEGER DEFAULT 0,
  total        INTEGER DEFAULT 0,
  accuracy     NUMERIC(5,2) DEFAULT 0,
  time_taken   INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_select_own" ON submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "submissions_insert_own" ON submissions FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_test ON submissions(test_id);

-- ─── MISTAKE VAULT ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mistake_vault (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id   UUID REFERENCES questions(id) ON DELETE CASCADE,
  review_count  INTEGER DEFAULT 0,
  next_review   DATE DEFAULT (CURRENT_DATE + INTERVAL '3 days'),
  last_reviewed DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

ALTER TABLE mistake_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vault_select_own" ON mistake_vault FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "vault_insert_own" ON mistake_vault FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "vault_update_own" ON mistake_vault FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "vault_delete_own" ON mistake_vault FOR DELETE USING (user_id = auth.uid());

-- ─── BADGES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT DEFAULT '🏆',
  xp_reward   INTEGER DEFAULT 50,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id  UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_select_all" ON badges FOR SELECT USING (true);
CREATE POLICY "user_badges_select_own" ON user_badges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "user_badges_insert_own" ON user_badges FOR INSERT WITH CHECK (user_id = auth.uid());

-- ─── ANALYTICS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date         DATE DEFAULT CURRENT_DATE,
  subject      TEXT DEFAULT 'General',
  time_spent   INTEGER DEFAULT 0,
  tests_taken  INTEGER DEFAULT 0,
  avg_accuracy NUMERIC(5,2) DEFAULT 0,
  xp_earned    INTEGER DEFAULT 0,
  UNIQUE(user_id, date, subject)
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analytics_select_own" ON analytics FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "analytics_insert_own" ON analytics FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "analytics_update_own" ON analytics FOR UPDATE USING (user_id = auth.uid());

CREATE INDEX idx_analytics_user_date ON analytics(user_id, date);

-- ─── TRIGGER: auto-create profile on signup ───────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  base_username := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
    NULLIF(TRIM(split_part(NEW.email, '@', 1)), ''),
    'student'
  );
  
  final_username := base_username;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) THEN
    final_username := base_username || '_' || substr(replace(NEW.id::text, '-', ''), 1, 6);
  END IF;

  INSERT INTO public.profiles (
    id, full_name, avatar_url, username, daily_goal_hours, xp, level, streak, theme
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', final_username),
    NEW.raw_user_meta_data->>'avatar_url',
    final_username,
    4, 0, 1, 0, 'light'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user caught exception: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── SEED: Subjects ───────────────────────────────────────
INSERT INTO subjects (name, icon, color) VALUES
  ('Mathematics',   '📐', '#6366f1'),
  ('Physics',       '⚛️',  '#3b82f6'),
  ('Chemistry',     '🧪', '#10b981'),
  ('Biology',       '🧬', '#f59e0b'),
  ('English',       '📝', '#ef4444'),
  ('Computer Sci.', '💻', '#8b5cf6'),
  ('History',       '📜', '#f97316'),
  ('Geography',     '🌍', '#14b8a6')
ON CONFLICT DO NOTHING;

-- ─── SEED: Badges ─────────────────────────────────────────
INSERT INTO badges (name, description, icon, xp_reward) VALUES
  ('First Step',        'Complete your first task',            '🌱', 25),
  ('Goal Crusher',      'Complete daily goal 3 days in a row', '🎯', 100),
  ('7-Day Streak',      'Maintain a 7-day study streak',       '🔥', 200),
  ('Quiz Master',       'Score 100% on any test',              '🏆', 150),
  ('Comeback King',     'Review 10 mistakes from the vault',   '💪', 100),
  ('Scholar',           'Reach Level 3',                       '🎓', 200),
  ('Speed Demon',       'Complete a timed test with 2 min left','⚡', 75),
  ('Perfectionist',     'Complete 5 tests with >90% accuracy', '💎', 250)
ON CONFLICT DO NOTHING;
