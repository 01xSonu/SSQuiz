-- ══════════════════════════════════════════════════════════════════════
-- SSQuiz — Fix for "Database error saving new user"
-- Copy and run this script in your Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════════════

-- 1. Ensure schema & table permissions are granted
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Drop existing trigger if present
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Replace function with robust error-handled version
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
  -- Extract username from metadata or email prefix
  base_username := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
    NULLIF(TRIM(split_part(NEW.email, '@', 1)), ''),
    'student'
  );
  
  -- Handle potential username collision gracefully
  final_username := base_username;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) THEN
    final_username := base_username || '_' || substr(replace(NEW.id::text, '-', ''), 1, 6);
  END IF;

  -- Upsert profile record
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    username,
    daily_goal_hours,
    xp,
    level,
    streak,
    theme
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', final_username),
    NEW.raw_user_meta_data->>'avatar_url',
    final_username,
    4,
    0,
    1,
    0,
    'light'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Crucial: never abort auth.users transaction
    RAISE WARNING 'handle_new_user caught exception: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 4. Re-create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
