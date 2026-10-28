-- ══════════════════════════════════════════════════════════════════════
-- SSQuiz — Kinematics I (SSC CGL & CHSL Physics)
-- 20 Questions | Medium Difficulty | 30 Minutes | Locked by Default
-- ══════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_physics_id UUID;
  v_test_id UUID;
BEGIN
  -- 1. Get Physics Subject ID
  SELECT id INTO v_physics_id FROM public.subjects WHERE name = 'Physics' LIMIT 1;

  -- 2. Insert Test Paper (Locked by default for anti-cheating)
  INSERT INTO public.tests (
    subject_id,
    title,
    description,
    difficulty,
    mode,
    duration_min,
    total_marks,
    topic,
    is_published,
    is_locked
  ) VALUES (
    v_physics_id,
    'Kinematics I',
    'SSC CGL & CHSL Physics: Motion in 1D & 2D, Speed, Velocity, Equations of Motion, Graphs, Free Fall & Projectiles (20 MCQs • 30 mins).',
    'medium',
    'timed',
    30,
    20,
    'Kinematics',
    true,
    true
  )
  RETURNING id INTO v_test_id;

  -- 3. Insert 20 SSC Exam-Oriented MCQs
  INSERT INTO public.questions (test_id, question, options, correct_ans, explanation, marks, order_num) VALUES
  (
    v_test_id,
    'A particle travels in a circular path of radius R. What is the magnitude of its displacement when it completes half a revolution?',
    '{"A": "Zero", "B": "πR", "C": "2R", "D": "2πR"}',
    'C',
    'Distance covered in half a revolution is half of circumference (πR), but displacement is the shortest straight-line distance between initial and final opposite points on the circle''s diameter, which equals 2R.',
    1, 1
  ),
  (
    v_test_id,
    'A car travels from city A to B at a uniform speed of 40 km/h and returns from B to A at 60 km/h. What is the average speed for the whole journey?',
    '{"A": "50 km/h", "B": "48 km/h", "C": "52 km/h", "D": "45 km/h"}',
    'B',
    'When equal distances are covered at speeds v1 and v2, Average Speed is given by the harmonic mean: (2 * v1 * v2) / (v1 + v2) = (2 * 40 * 60) / (40 + 60) = 4800 / 100 = 48 km/h.',
    1, 2
  ),
  (
    v_test_id,
    'What physical quantity is represented by the slope of a displacement-time (s-t) graph?',
    '{"A": "Acceleration", "B": "Velocity", "C": "Momentum", "D": "Force"}',
    'B',
    'The slope of a displacement-time graph (ds/dt) represents velocity. A straight inclined line indicates uniform velocity, while a curved line indicates changing velocity (acceleration).',
    1, 3
  ),
  (
    v_test_id,
    'The area under a velocity-time (v-t) graph between time t1 and t2 gives:',
    '{"A": "Acceleration", "B": "Total distance / displacement", "C": "Instantaneous speed", "D": "Force"}',
    'B',
    'The area under a velocity-time curve represents the integral ∫ v dt, which equals the total displacement (or distance in 1D rectilinear motion) of the body.',
    1, 4
  ),
  (
    v_test_id,
    'A stone is thrown vertically upwards. At the highest point of its trajectory, which statement is correct?',
    '{"A": "Both velocity and acceleration are zero", "B": "Velocity is maximum and acceleration is zero", "C": "Velocity is zero and acceleration is g downwards", "D": "Velocity is zero and acceleration is g upwards"}',
    'C',
    'At the highest point, the stone momentarily stops (v = 0), but the acceleration due to gravity (g ≈ 9.8 m/s²) continuously pulls it downwards.',
    1, 5
  ),
  (
    v_test_id,
    'A body starts from rest and moves with uniform acceleration. The ratio of distances covered in the 1st, 2nd, and 3rd seconds is:',
    '{"A": "1 : 2 : 3", "B": "1 : 4 : 9", "C": "1 : 3 : 5", "D": "1 : 8 : 27"}',
    'C',
    'According to Galileo''s law of odd numbers, distance covered in the n-th second is Sn = u + a/2(2n - 1). For u = 0, Sn ∝ (2n - 1). For n = 1, 2, 3, the ratio is (2*1 - 1) : (2*2 - 1) : (2*3 - 1) = 1 : 3 : 5.',
    1, 6
  ),
  (
    v_test_id,
    'A car moving at speed ''v'' is brought to rest in distance ''s'' by applying brakes. If the speed of the car is tripled (3v), the minimum stopping distance under identical braking force will be:',
    '{"A": "3s", "B": "6s", "C": "9s", "D": "s/3"}',
    'C',
    'From v² = u² - 2as, stopping distance s = u² / (2a) (since v = 0). Thus, stopping distance is proportional to u². Tripling the speed (3u) increases stopping distance by 3² = 9 times (9s).',
    1, 7
  ),
  (
    v_test_id,
    'For a given velocity of projection, the horizontal range of a projectile is maximum when the angle of projection with the horizontal is:',
    '{"A": "30°", "B": "45°", "C": "60°", "D": "90°"}',
    'B',
    'Horizontal range is R = (u² * sin 2θ) / g. Range is maximum when sin(2θ) = 1, which gives 2θ = 90° or θ = 45°.',
    1, 8
  ),
  (
    v_test_id,
    'In ideal projectile motion, which component of velocity remains constant throughout the flight?',
    '{"A": "Vertical component", "B": "Horizontal component", "C": "Radial component", "D": "None of these"}',
    'B',
    'Since gravity acts only vertically downwards, there is zero acceleration in the horizontal direction (ax = 0). Therefore, the horizontal velocity component ux = u * cos θ remains constant throughout the motion.',
    1, 9
  ),
  (
    v_test_id,
    'A ball is dropped from a cliff 80 meters high. How long will it take to reach the ground? (Take g = 10 m/s²)',
    '{"A": "2 seconds", "B": "4 seconds", "C": "6 seconds", "D": "8 seconds"}',
    'B',
    'Using h = ut + (1/2)gt². Since initial velocity u = 0: 80 = (1/2) * 10 * t² => 80 = 5t² => t² = 16 => t = 4 seconds.',
    1, 10
  ),
  (
    v_test_id,
    'Which of the following is true for an object in uniform circular motion?',
    '{"A": "Speed is constant, but velocity changes continuously", "B": "Both speed and velocity are constant", "C": "Velocity is constant, but speed changes", "D": "Acceleration is zero"}',
    'A',
    'In uniform circular motion, magnitude of velocity (speed) is constant, but the direction of motion continuously changes at every single point. Hence, it is an accelerated motion with constant speed and variable velocity.',
    1, 11
  ),
  (
    v_test_id,
    'Centripetal acceleration in uniform circular motion is always directed:',
    '{"A": "Tangential to the circular path", "B": "Along the radius, towards the center", "C": "Along the radius, away from the center", "D": "Opposite to the velocity vector"}',
    'B',
    'Centripetal acceleration has magnitude ac = v²/r and is always directed along the radius vector pointing towards the center of curvature of the path.',
    1, 12
  ),
  (
    v_test_id,
    'Which device installed in vehicles measures the instantaneous speed of the automobile?',
    '{"A": "Odometer", "B": "Speedometer", "C": "Chronometer", "D": "Altimeter"}',
    'B',
    'A speedometer measures the instantaneous speed of the vehicle. An odometer measures total distance traveled, while an altimeter measures altitude above sea level.',
    1, 13
  ),
  (
    v_test_id,
    'A passenger in a train tossing a coin vertically upwards finds that the coin falls BEHIND him. This indicates that the train is moving with:',
    '{"A": "Uniform speed", "B": "Acceleration (speeding up)", "C": "Retardation (slowing down)", "D": "Circular motion"}',
    'B',
    'When the coin is thrown, it shares the train''s horizontal speed at that instant. If the train accelerates forward, the train moves ahead while the coin covers less horizontal distance, causing the coin to fall behind the passenger.',
    1, 14
  ),
  (
    v_test_id,
    'A feather and a lead ball are dropped simultaneously from the same height in a complete vacuum. Which one touches the ground first?',
    '{"A": "The lead ball", "B": "The feather", "C": "Both reach the ground simultaneously", "D": "Depends on their surface area"}',
    'C',
    'In a vacuum, air resistance is zero. Galileo proved that all objects fall with the exact same acceleration due to gravity (g = 9.8 m/s²) regardless of mass or shape, so both reach the ground at the exact same time.',
    1, 15
  ),
  (
    v_test_id,
    'A particle starting from rest moves with a constant acceleration of 3 m/s². What will be its velocity after 6 seconds?',
    '{"A": "9 m/s", "B": "18 m/s", "C": "36 m/s", "D": "54 m/s"}',
    'B',
    'Using the first equation of motion: v = u + at. With u = 0, a = 3 m/s², and t = 6 s: v = 0 + (3 * 6) = 18 m/s.',
    1, 16
  ),
  (
    v_test_id,
    'Two trains of length 150 m and 250 m are moving on parallel tracks towards each other with speeds of 54 km/h and 90 km/h. How long will they take to completely pass each other?',
    '{"A": "10 seconds", "B": "12 seconds", "C": "15 seconds", "D": "20 seconds"}',
    'A',
    'Total distance = 150 + 250 = 400 m. Since they travel in opposite directions, relative speed = 54 + 90 = 144 km/h = 144 * (5/18) = 40 m/s. Time = Distance / Speed = 400 / 40 = 10 seconds.',
    1, 17
  ),
  (
    v_test_id,
    'The position of an object is given by x(t) = 4t² - 2t + 7 (in meters). What is its acceleration at t = 3 seconds?',
    '{"A": "8 m/s²", "B": "22 m/s²", "C": "24 m/s²", "D": "4 m/s²"}',
    'A',
    'Velocity v = dx/dt = 8t - 2. Acceleration a = dv/dt = d(8t - 2)/dt = 8 m/s². The acceleration is constant and equals 8 m/s² at any instant.',
    1, 18
  ),
  (
    v_test_id,
    'A ball is projected vertically upwards with a velocity of 30 m/s. What is the maximum height reached? (Take g = 10 m/s²)',
    '{"A": "30 m", "B": "45 m", "C": "90 m", "D": "60 m"}',
    'B',
    'At maximum height, v = 0. Using v² = u² - 2gh: 0 = (30)² - 2(10)h => 20h = 900 => h = 45 meters.',
    1, 19
  ),
  (
    v_test_id,
    'Which of the following pairs contains one SCALAR and one VECTOR quantity?',
    '{"A": "Distance and Speed", "B": "Velocity and Acceleration", "C": "Speed and Velocity", "D": "Displacement and Force"}',
    'C',
    'Speed is a scalar quantity (has only magnitude), while Velocity is a vector quantity (has both magnitude and direction). Options A, B, and D contain either two scalars or two vectors.',
    1, 20
  );
END $$;
