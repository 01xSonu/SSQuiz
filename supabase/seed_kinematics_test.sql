-- ══════════════════════════════════════════════════════════════════════
-- SSQuiz — Kinematics I & II (SSC CGL & CHSL Physics)
-- Kinematics I: Easy / Fundamental Level (20 MCQs • 30 mins)
-- Kinematics II: Medium / Applied Level (20 MCQs • 30 mins)
-- Both papers are Locked by default for Anti-Cheating Protection
-- ══════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_physics_id UUID;
  v_test1_id UUID;
  v_test2_id UUID;
BEGIN
  -- 1. Get Physics Subject ID
  SELECT id INTO v_physics_id FROM public.subjects WHERE name = 'Physics' LIMIT 1;

  -- ════════════════════════════════════════════════════════════════════
  -- TEST 1: Kinematics I (Easy / Core Fundamentals & PYQs)
  -- ════════════════════════════════════════════════════════════════════
  INSERT INTO public.tests (
    subject_id, title, description, difficulty, mode, duration_min, total_marks, topic, is_published, is_locked
  ) VALUES (
    v_physics_id,
    'Kinematics I',
    'SSC CGL & CHSL Physics (Fundamentals & PYQs): Speed, Velocity, Acceleration, Equations of Motion, SI Units & Core Concepts (20 MCQs • 30 mins).',
    'easy',
    'timed',
    30,
    20,
    'Kinematics',
    true,
    true
  )
  RETURNING id INTO v_test1_id;

  INSERT INTO public.questions (test_id, question, options, correct_ans, explanation, marks, order_num) VALUES
  (
    v_test1_id,
    'What is the SI unit of speed and velocity?',
    '{"A": "m/s²", "B": "m/s", "C": "km/h²", "D": "m · s"}',
    'B',
    'Both speed and velocity represent distance/displacement divided by time, so their standard SI unit is meter per second (m/s).',
    1, 1
  ),
  (
    v_test1_id,
    'What is the SI unit of acceleration?',
    '{"A": "m/s", "B": "m · s", "C": "m/s²", "D": "kg · m/s"}',
    'C',
    'Acceleration is the rate of change of velocity with time (velocity/time = (m/s)/s), so its SI unit is meter per second squared (m/s²).',
    1, 2
  ),
  (
    v_test1_id,
    'Which instrument fitted in an automobile measures the total distance traveled by the vehicle?',
    '{"A": "Speedometer", "B": "Odometer", "C": "Barometer", "D": "Thermometer"}',
    'B',
    'An odometer (also called odograph) measures and displays the cumulative distance covered by a vehicle. A speedometer measures instantaneous speed.',
    1, 3
  ),
  (
    v_test1_id,
    'The rate of change of displacement with respect to time is called:',
    '{"A": "Speed", "B": "Velocity", "C": "Acceleration", "D": "Momentum"}',
    'B',
    'Velocity is defined as displacement per unit time (a vector). Rate of change of distance is speed (a scalar).',
    1, 4
  ),
  (
    v_test1_id,
    'The rate of change of velocity with respect to time is known as:',
    '{"A": "Speed", "B": "Force", "C": "Acceleration", "D": "Work"}',
    'C',
    'Acceleration = (Change in Velocity) / (Time Taken). It indicates how fast the velocity of an object is increasing or decreasing.',
    1, 5
  ),
  (
    v_test1_id,
    'Negative acceleration is commonly referred to as:',
    '{"A": "Velocity", "B": "Retardation (or Deceleration)", "C": "Inertia", "D": "Friction"}',
    'B',
    'When the velocity of an object decreases with time, its acceleration is negative. Negative acceleration is called retardation or deceleration.',
    1, 6
  ),
  (
    v_test1_id,
    'If an athlete completes one full round of a circular track of radius R and returns to the starting point, his displacement is:',
    '{"A": "2πR", "B": "πR", "C": "Zero", "D": "2R"}',
    'C',
    'Displacement is the shortest straight-line distance between the initial and final position. Because the athlete returns to the exact starting point, displacement = 0 (while distance = 2πR).',
    1, 7
  ),
  (
    v_test1_id,
    'Which of the following physical quantities can NEVER be negative?',
    '{"A": "Velocity", "B": "Acceleration", "C": "Distance", "D": "Displacement"}',
    'C',
    'Distance is the actual length of path traversed and is a scalar quantity that is always positive or zero. Displacement, velocity, and acceleration can be positive, negative, or zero depending on direction.',
    1, 8
  ),
  (
    v_test1_id,
    'Which of the following is a SCALAR quantity?',
    '{"A": "Displacement", "B": "Velocity", "C": "Speed", "D": "Acceleration"}',
    'C',
    'Speed has only magnitude and no specific direction, so it is a scalar quantity. Displacement, velocity, and acceleration have both magnitude and direction, so they are vector quantities.',
    1, 9
  ),
  (
    v_test1_id,
    'Which of the following is a VECTOR quantity?',
    '{"A": "Time", "B": "Distance", "C": "Displacement", "D": "Mass"}',
    'C',
    'Displacement specifies both the distance between two points and the direction from the starting point to the ending point, making it a vector quantity.',
    1, 10
  ),
  (
    v_test1_id,
    'If an object travels at a constant velocity of 15 m/s, what is its acceleration?',
    '{"A": "15 m/s²", "B": "9.8 m/s²", "C": "Zero", "D": "1.5 m/s²"}',
    'C',
    'Acceleration is the change in velocity divided by time. If velocity is constant (no change), Δv = 0, so acceleration is exactly zero.',
    1, 11
  ),
  (
    v_test1_id,
    'A car accelerates from rest at a uniform rate of 2 m/s² for 5 seconds. What is its final velocity?',
    '{"A": "5 m/s", "B": "7 m/s", "C": "10 m/s", "D": "20 m/s"}',
    'C',
    'From the first equation of motion: v = u + at. Starting from rest means initial velocity u = 0. Therefore, v = 0 + (2 * 5) = 10 m/s.',
    1, 12
  ),
  (
    v_test1_id,
    'Which of the following correctly represents the second equation of motion?',
    '{"A": "v = u + at", "B": "s = ut + (1/2)at²", "C": "v² - u² = 2as", "D": "s = (v - u) / t"}',
    'B',
    'The second equation of motion relates displacement (s), initial velocity (u), time (t), and uniform acceleration (a): s = ut + (1/2)at².',
    1, 13
  ),
  (
    v_test1_id,
    'Which of the following represents the third equation of motion relating velocity, acceleration, and distance?',
    '{"A": "v = u + at", "B": "s = ut + (1/2)at²", "C": "v² = u² + 2as", "D": "v = u - at"}',
    'C',
    'The third equation of motion is v² = u² + 2as (or v² - u² = 2as). It eliminates the time variable ''t''.',
    1, 14
  ),
  (
    v_test1_id,
    'A train covers a distance of 180 km in 3 hours at uniform speed. What is its speed in m/s?',
    '{"A": "60 m/s", "B": "16.67 m/s", "C": "25 m/s", "D": "30 m/s"}',
    'B',
    'Speed = Distance / Time = 180 km / 3 h = 60 km/h. To convert km/h to m/s, multiply by 5/18: 60 * (5/18) = 300/18 ≈ 16.67 m/s.',
    1, 15
  ),
  (
    v_test1_id,
    'What is the standard value of acceleration due to gravity (g) near the surface of the Earth?',
    '{"A": "8.9 m/s²", "B": "9.8 m/s²", "C": "10.8 m/s²", "D": "6.67 m/s²"}',
    'B',
    'The standard acceleration due to Earth''s gravity at sea level is approximately 9.8 m/s² (frequently rounded to 10 m/s² in rough calculations).',
    1, 16
  ),
  (
    v_test1_id,
    'On a distance-time graph, a horizontal straight line parallel to the time axis indicates that the object is:',
    '{"A": "Moving with uniform speed", "B": "Moving with increasing speed", "C": "At rest (stationary)", "D": "Moving with negative acceleration"}',
    'C',
    'A horizontal line parallel to the time axis on a distance-time graph means distance is not changing as time passes. Hence, the object is at rest (speed = 0).',
    1, 17
  ),
  (
    v_test1_id,
    'The motion of a freely falling body dropped from a height under gravity is an example of:',
    '{"A": "Non-uniformly accelerated motion", "B": "Uniformly accelerated motion", "C": "Motion with uniform velocity", "D": "Non-accelerated motion"}',
    'B',
    'When a body falls freely under gravity (neglecting air friction), it experiences a constant downward acceleration equal to g (9.8 m/s²). Hence, it is uniformly accelerated motion.',
    1, 18
  ),
  (
    v_test1_id,
    'A runner covers 100 meters in 10 seconds. What is the average speed of the runner?',
    '{"A": "5 m/s", "B": "10 m/s", "C": "20 m/s", "D": "100 m/s"}',
    'B',
    'Average Speed = Total Distance / Total Time = 100 m / 10 s = 10 m/s.',
    1, 19
  ),
  (
    v_test1_id,
    'When a body moves along a circular path with constant speed, its motion is called:',
    '{"A": "Uniform circular motion", "B": "Linear motion", "C": "Rectilinear motion", "D": "Oscillatory motion"}',
    'A',
    'When an object follows a circular path at a constant speed, it is in uniform circular motion. Its speed is constant, but velocity continuously changes direction.',
    1, 20
  );

  -- ════════════════════════════════════════════════════════════════════
  -- TEST 2: Kinematics II (Medium / Applied & Numerical Level)
  -- ════════════════════════════════════════════════════════════════════
  INSERT INTO public.tests (
    subject_id, title, description, difficulty, mode, duration_min, total_marks, topic, is_published, is_locked
  ) VALUES (
    v_physics_id,
    'Kinematics II',
    'SSC CGL & CHSL Physics (Moderate to Advanced): 2D Motion, Projectiles, Circular Motion, Graphs & Numerical Problems (20 MCQs • 30 mins).',
    'medium',
    'timed',
    30,
    20,
    'Kinematics',
    true,
    true
  )
  RETURNING id INTO v_test2_id;

  INSERT INTO public.questions (test_id, question, options, correct_ans, explanation, marks, order_num) VALUES
  (
    v_test2_id,
    'A particle travels in a circular path of radius R. What is the magnitude of its displacement when it completes half a revolution?',
    '{"A": "Zero", "B": "πR", "C": "2R", "D": "2πR"}',
    'C',
    'Distance covered in half a revolution is half of circumference (πR), but displacement is the shortest straight-line distance between initial and final opposite points on the circle''s diameter, which equals 2R.',
    1, 1
  ),
  (
    v_test2_id,
    'A car travels from city A to B at a uniform speed of 40 km/h and returns from B to A at 60 km/h. What is the average speed for the whole journey?',
    '{"A": "50 km/h", "B": "48 km/h", "C": "52 km/h", "D": "45 km/h"}',
    'B',
    'When equal distances are covered at speeds v1 and v2, Average Speed is given by the harmonic mean: (2 * v1 * v2) / (v1 + v2) = (2 * 40 * 60) / (40 + 60) = 4800 / 100 = 48 km/h.',
    1, 2
  ),
  (
    v_test2_id,
    'What physical quantity is represented by the slope of a displacement-time (s-t) graph?',
    '{"A": "Acceleration", "B": "Velocity", "C": "Momentum", "D": "Force"}',
    'B',
    'The slope of a displacement-time graph (ds/dt) represents velocity. A straight inclined line indicates uniform velocity, while a curved line indicates changing velocity (acceleration).',
    1, 3
  ),
  (
    v_test2_id,
    'The area under a velocity-time (v-t) graph between time t1 and t2 gives:',
    '{"A": "Acceleration", "B": "Total distance / displacement", "C": "Instantaneous speed", "D": "Force"}',
    'B',
    'The area under a velocity-time curve represents the integral ∫ v dt, which equals the total displacement (or distance in 1D rectilinear motion) of the body.',
    1, 4
  ),
  (
    v_test2_id,
    'A stone is thrown vertically upwards. At the highest point of its trajectory, which statement is correct?',
    '{"A": "Both velocity and acceleration are zero", "B": "Velocity is maximum and acceleration is zero", "C": "Velocity is zero and acceleration is g downwards", "D": "Velocity is zero and acceleration is g upwards"}',
    'C',
    'At the highest point, the stone momentarily stops (v = 0), but the acceleration due to gravity (g ≈ 9.8 m/s²) continuously pulls it downwards.',
    1, 5
  ),
  (
    v_test2_id,
    'A body starts from rest and moves with uniform acceleration. The ratio of distances covered in the 1st, 2nd, and 3rd seconds is:',
    '{"A": "1 : 2 : 3", "B": "1 : 4 : 9", "C": "1 : 3 : 5", "D": "1 : 8 : 27"}',
    'C',
    'According to Galileo''s law of odd numbers, distance covered in the n-th second is Sn = u + a/2(2n - 1). For u = 0, Sn ∝ (2n - 1). For n = 1, 2, 3, the ratio is (2*1 - 1) : (2*2 - 1) : (2*3 - 1) = 1 : 3 : 5.',
    1, 6
  ),
  (
    v_test2_id,
    'A car moving at speed ''v'' is brought to rest in distance ''s'' by applying brakes. If the speed of the car is tripled (3v), the minimum stopping distance under identical braking force will be:',
    '{"A": "3s", "B": "6s", "C": "9s", "D": "s/3"}',
    'C',
    'From v² = u² - 2as, stopping distance s = u² / (2a) (since v = 0). Thus, stopping distance is proportional to u². Tripling the speed (3u) increases stopping distance by 3² = 9 times (9s).',
    1, 7
  ),
  (
    v_test2_id,
    'For a given velocity of projection, the horizontal range of a projectile is maximum when the angle of projection with the horizontal is:',
    '{"A": "30°", "B": "45°", "C": "60°", "D": "90°"}',
    'B',
    'Horizontal range is R = (u² * sin 2θ) / g. Range is maximum when sin(2θ) = 1, which gives 2θ = 90° or θ = 45°.',
    1, 8
  ),
  (
    v_test2_id,
    'In ideal projectile motion, which component of velocity remains constant throughout the flight?',
    '{"A": "Vertical component", "B": "Horizontal component", "C": "Radial component", "D": "None of these"}',
    'B',
    'Since gravity acts only vertically downwards, there is zero acceleration in the horizontal direction (ax = 0). Therefore, the horizontal velocity component ux = u * cos θ remains constant throughout the motion.',
    1, 9
  ),
  (
    v_test2_id,
    'A ball is dropped from a cliff 80 meters high. How long will it take to reach the ground? (Take g = 10 m/s²)',
    '{"A": "2 seconds", "B": "4 seconds", "C": "6 seconds", "D": "8 seconds"}',
    'B',
    'Using h = ut + (1/2)gt². Since initial velocity u = 0: 80 = (1/2) * 10 * t² => 80 = 5t² => t² = 16 => t = 4 seconds.',
    1, 10
  ),
  (
    v_test2_id,
    'Which of the following is true for an object in uniform circular motion?',
    '{"A": "Speed is constant, but velocity changes continuously", "B": "Both speed and velocity are constant", "C": "Velocity is constant, but speed changes", "D": "Acceleration is zero"}',
    'A',
    'In uniform circular motion, magnitude of velocity (speed) is constant, but the direction of motion continuously changes at every single point. Hence, it is an accelerated motion with constant speed and variable velocity.',
    1, 11
  ),
  (
    v_test2_id,
    'Centripetal acceleration in uniform circular motion is always directed:',
    '{"A": "Tangential to the circular path", "B": "Along the radius, towards the center", "C": "Along the radius, away from the center", "D": "Opposite to the velocity vector"}',
    'B',
    'Centripetal acceleration has magnitude ac = v²/r and is always directed along the radius vector pointing towards the center of curvature of the path.',
    1, 12
  ),
  (
    v_test2_id,
    'Which device installed in vehicles measures the instantaneous speed of the automobile?',
    '{"A": "Odometer", "B": "Speedometer", "C": "Chronometer", "D": "Altimeter"}',
    'B',
    'A speedometer measures the instantaneous speed of the vehicle. An odometer measures total distance traveled, while an altimeter measures altitude above sea level.',
    1, 13
  ),
  (
    v_test2_id,
    'A passenger in a train tossing a coin vertically upwards finds that the coin falls BEHIND him. This indicates that the train is moving with:',
    '{"A": "Uniform speed", "B": "Acceleration (speeding up)", "C": "Retardation (slowing down)", "D": "Circular motion"}',
    'B',
    'When the coin is thrown, it shares the train''s horizontal speed at that instant. If the train accelerates forward, the train moves ahead while the coin covers less horizontal distance, causing the coin to fall behind the passenger.',
    1, 14
  ),
  (
    v_test2_id,
    'A feather and a lead ball are dropped simultaneously from the same height in a complete vacuum. Which one touches the ground first?',
    '{"A": "The lead ball", "B": "The feather", "C": "Both reach the ground simultaneously", "D": "Depends on their surface area"}',
    'C',
    'In a vacuum, air resistance is zero. Galileo proved that all objects fall with the exact same acceleration due to gravity (g = 9.8 m/s²) regardless of mass or shape, so both reach the ground at the exact same time.',
    1, 15
  ),
  (
    v_test2_id,
    'A particle starting from rest moves with a constant acceleration of 3 m/s². What will be its velocity after 6 seconds?',
    '{"A": "9 m/s", "B": "18 m/s", "C": "36 m/s", "D": "54 m/s"}',
    'B',
    'Using the first equation of motion: v = u + at. With u = 0, a = 3 m/s², and t = 6 s: v = 0 + (3 * 6) = 18 m/s.',
    1, 16
  ),
  (
    v_test2_id,
    'Two trains of length 150 m and 250 m are moving on parallel tracks towards each other with speeds of 54 km/h and 90 km/h. How long will they take to completely pass each other?',
    '{"A": "10 seconds", "B": "12 seconds", "C": "15 seconds", "D": "20 seconds"}',
    'A',
    'Total distance = 150 + 250 = 400 m. Since they travel in opposite directions, relative speed = 54 + 90 = 144 km/h = 144 * (5/18) = 40 m/s. Time = Distance / Speed = 400 / 40 = 10 seconds.',
    1, 17
  ),
  (
    v_test2_id,
    'The position of an object is given by x(t) = 4t² - 2t + 7 (in meters). What is its acceleration at t = 3 seconds?',
    '{"A": "8 m/s²", "B": "22 m/s²", "C": "24 m/s²", "D": "4 m/s²"}',
    'A',
    'Velocity v = dx/dt = 8t - 2. Acceleration a = dv/dt = d(8t - 2)/dt = 8 m/s². The acceleration is constant and equals 8 m/s² at any instant.',
    1, 18
  ),
  (
    v_test2_id,
    'A ball is projected vertically upwards with a velocity of 30 m/s. What is the maximum height reached? (Take g = 10 m/s²)',
    '{"A": "30 m", "B": "45 m", "C": "90 m", "D": "60 m"}',
    'B',
    'At maximum height, v = 0. Using v² = u² - 2gh: 0 = (30)² - 2(10)h => 20h = 900 => h = 45 meters.',
    1, 19
  ),
  (
    v_test2_id,
    'Which of the following pairs contains one SCALAR and one VECTOR quantity?',
    '{"A": "Distance and Speed", "B": "Velocity and Acceleration", "C": "Speed and Velocity", "D": "Displacement and Force"}',
    'C',
    'Speed is a scalar quantity (has only magnitude), while Velocity is a vector quantity (has both magnitude and direction). Options A, B, and D contain either two scalars or two vectors.',
    1, 20
  );
END $$;
