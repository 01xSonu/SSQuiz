-- ══════════════════════════════════════════════════════════════════════
-- SSQuiz — Sample Test Papers & MCQs Seed Script
-- Run this in your Supabase SQL Editor to populate ready-to-take tests!
-- ══════════════════════════════════════════════════════════════════════

-- 0. Ensure authenticated users can also insert tests and questions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tests_insert_authenticated') THEN
    CREATE POLICY "tests_insert_authenticated" ON tests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'questions_insert_authenticated') THEN
    CREATE POLICY "questions_insert_authenticated" ON questions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$
DECLARE
  v_math_id UUID;
  v_physics_id UUID;
  v_chem_id UUID;
  v_test1_id UUID;
  v_test2_id UUID;
  v_test3_id UUID;
BEGIN
  -- 1. Fetch Subject IDs
  SELECT id INTO v_math_id FROM public.subjects WHERE name = 'Mathematics' LIMIT 1;
  SELECT id INTO v_physics_id FROM public.subjects WHERE name = 'Physics' LIMIT 1;
  SELECT id INTO v_chem_id FROM public.subjects WHERE name = 'Chemistry' LIMIT 1;

  -- ─── TEST 1: Mathematics - Differential Calculus ─────────────────
  INSERT INTO public.tests (subject_id, title, description, difficulty, mode, duration_min, total_marks, topic, is_published)
  VALUES (
    v_math_id,
    'Differential Calculus & Limits Practice',
    'Master key calculus concepts: limits, derivatives of composite functions, and rate of change.',
    'medium',
    'timed',
    15,
    5,
    'Calculus',
    true
  )
  RETURNING id INTO v_test1_id;

  INSERT INTO public.questions (test_id, question, options, correct_ans, explanation, marks, order_num) VALUES
  (
    v_test1_id,
    'What is the derivative of f(x) = sin(x^2) with respect to x?',
    '{"A": "cos(x^2)", "B": "2x * cos(x^2)", "C": "-2x * cos(x^2)", "D": "2 * sin(x) * cos(x)"}',
    'B',
    'Using the Chain Rule: d/dx[sin(u)] = cos(u) * du/dx. Here u = x^2, so du/dx = 2x. Therefore, f''(x) = 2x * cos(x^2).',
    1,
    1
  ),
  (
    v_test1_id,
    'Evaluate the limit: lim (x -> 0) [sin(3x) / x]',
    '{"A": "0", "B": "1", "C": "3", "D": "Undefined"}',
    'C',
    'Using the standard limit property: lim (x -> 0) [sin(kx) / (kx)] * k = 1 * 3 = 3.',
    1,
    2
  ),
  (
    v_test1_id,
    'What is the slope of the tangent line to y = x^3 - 3x at x = 2?',
    '{"A": "9", "B": "6", "C": "3", "D": "12"}',
    'A',
    'The derivative is dy/dx = 3x^2 - 3. At x = 2: 3(2)^2 - 3 = 12 - 3 = 9.',
    1,
    3
  ),
  (
    v_test1_id,
    'If f(x) = e^(4x), what is f''(x)?',
    '{"A": "e^(4x)", "B": "4 * e^(4x)", "C": "16 * e^(4x)", "D": "4x * e^(4x)"}',
    'C',
    'First derivative: f''(x) = 4 * e^(4x). Second derivative: f''''(x) = 4 * 4 * e^(4x) = 16 * e^(4x).',
    1,
    4
  ),
  (
    v_test1_id,
    'A function f(x) has a local maximum at x = c if:',
    '{"A": "f''(c) = 0 and f''''(c) > 0", "B": "f''(c) = 0 and f''''(c) < 0", "C": "f''(c) > 0 and f''''(c) = 0", "D": "f(c) = 0"}',
    'B',
    'By the Second Derivative Test, if f''(c) = 0 and f''''(c) < 0, then f has a local maximum at x = c.',
    1,
    5
  );

  -- ─── TEST 2: Physics - Mechanics & Kinematics ────────────────────
  INSERT INTO public.tests (subject_id, title, description, difficulty, mode, duration_min, total_marks, topic, is_published)
  VALUES (
    v_physics_id,
    'Kinematics & Laws of Motion Quiz',
    'Essential questions on projectile motion, Newton laws, friction, and kinetic energy.',
    'easy',
    'instant',
    10,
    4,
    'Mechanics',
    true
  )
  RETURNING id INTO v_test2_id;

  INSERT INTO public.questions (test_id, question, options, correct_ans, explanation, marks, order_num) VALUES
  (
    v_test2_id,
    'At what launch angle is the range of a projectile maximum (neglecting air resistance)?',
    '{"A": "30 degrees", "B": "45 degrees", "C": "60 degrees", "D": "90 degrees"}',
    'B',
    'Range R = (u^2 * sin(2θ)) / g. The maximum value occurs when sin(2θ) = 1, which means 2θ = 90°, so θ = 45°.',
    1,
    1
  ),
  (
    v_test2_id,
    'If the net force acting on an object is doubled while its mass remains constant, its acceleration will:',
    '{"A": "Halve", "B": "Remain constant", "C": "Double", "D": "Quadruple"}',
    'C',
    'According to Newton''s Second Law, F = m * a. Therefore, a = F / m. Doubling F doubles the acceleration a.',
    1,
    2
  ),
  (
    v_test2_id,
    'What is the kinetic energy of a 2 kg object moving at a velocity of 4 m/s?',
    '{"A": "8 Joules", "B": "16 Joules", "C": "32 Joules", "D": "4 Joules"}',
    'B',
    'Kinetic Energy KE = (1/2) * m * v^2 = (1/2) * 2 * (4)^2 = 1 * 16 = 16 Joules.',
    1,
    3
  ),
  (
    v_test2_id,
    'Which of the following is a scalar quantity?',
    '{"A": "Displacement", "B": "Velocity", "C": "Acceleration", "D": "Work Done"}',
    'D',
    'Work done is the scalar (dot) product of force and displacement (W = F · d), having magnitude only with no directional vector.',
    1,
    4
  );

  -- ─── TEST 3: Chemistry - Atomic Structure & Bonding ──────────────
  INSERT INTO public.tests (subject_id, title, description, difficulty, mode, duration_min, total_marks, topic, is_published)
  VALUES (
    v_chem_id,
    'Chemical Bonding & Periodic Trends',
    'Test your understanding of electronegativity, hybridization, and molecular shapes.',
    'hard',
    'mock',
    20,
    4,
    'Inorganic Chemistry',
    true
  )
  RETURNING id INTO v_test3_id;

  INSERT INTO public.questions (test_id, question, options, correct_ans, explanation, marks, order_num) VALUES
  (
    v_chem_id,
    'What is the hybridization and geometric shape of the methane (CH4) molecule?',
    '{"A": "sp2, Trigonal Planar", "B": "sp3, Tetrahedral", "C": "sp, Linear", "D": "dsp2, Square Planar"}',
    'B',
    'Carbon in CH4 forms 4 single sigma bonds with zero lone pairs. Steric number = 4, resulting in sp3 hybridization and a tetrahedral geometry with bond angle ~109.5°.',
    1,
    1
  ),
  (
    v_chem_id,
    'Which element has the highest first ionization enthalpy in the periodic table?',
    '{"A": "Helium (He)", "B": "Fluorine (F)", "C": "Neon (Ne)", "D": "Hydrogen (H)"}',
    'A',
    'Helium has the highest ionization energy (~2372 kJ/mol) because of its tiny atomic radius, full 1s^2 valence shell, and strong nuclear attraction.',
    1,
    2
  ),
  (
    v_chem_id,
    'Which type of bond is formed when electrons are shared unequally between two nonmetals?',
    '{"A": "Nonpolar covalent bond", "B": "Ionic bond", "C": "Polar covalent bond", "D": "Metallic bond"}',
    'C',
    'A difference in electronegativity between two bonded atoms results in an unequal sharing of electrons, creating a dipole moment characteristic of a polar covalent bond.',
    1,
    3
  ),
  (
    v_chem_id,
    'Which of the following molecules has a dipole moment of zero (nonpolar)?',
    '{"A": "H2O", "B": "NH3", "C": "CO2", "D": "SO2"}',
    'C',
    'CO2 is linear (O=C=O). The two equal C=O bond dipole vectors point in directly opposite directions (180°), canceling each other out completely (net dipole = 0).',
    1,
    4
  );

END $$;
