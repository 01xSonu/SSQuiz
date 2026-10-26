// SSQuiz — TypeScript Types

export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  target_exam: string | null
  subject: string | null
  academic_year: string | null
  daily_goal_hours: number
  xp: number
  level: number
  streak: number
  last_active: string | null
  theme: 'light' | 'dark'
  created_at: string
}

export interface Subject {
  id: string
  name: string
  icon: string
  color: string
}

export interface Test {
  id: string
  subject_id: string
  title: string
  description: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  mode: 'timed' | 'instant' | 'mock'
  duration_min: number
  total_marks: number
  topic: string | null
  is_published: boolean
  created_at: string
  subjects?: Subject
  questions?: Question[]
}

export interface Question {
  id: string
  test_id: string
  question: string
  options: Record<string, string>   // { A: "...", B: "...", C: "...", D: "..." }
  correct_ans: string
  explanation: string | null
  marks: number
  order_num: number
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  priority: 'high' | 'medium' | 'low'
  category: 'revision' | 'practice' | 'lecture' | 'other'
  is_complete: boolean
  due_date: string
  rollover: boolean
  created_at: string
}

export interface Submission {
  id: string
  user_id: string
  test_id: string
  answers: Record<string, string>
  score: number
  total: number
  accuracy: number
  time_taken: number
  submitted_at: string
  tests?: Test
}

export interface MistakeVaultItem {
  id: string
  user_id: string
  question_id: string
  review_count: number
  next_review: string
  last_reviewed: string | null
  created_at: string
  questions?: Question & { tests?: Test }
}

export interface Badge {
  id: string
  name: string
  description: string | null
  icon: string
  xp_reward: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badges?: Badge
}

export interface Analytics {
  id: string
  user_id: string
  date: string
  subject: string
  time_spent: number
  tests_taken: number
  avg_accuracy: number
  xp_earned: number
}

export const XP_LEVELS = [
  { level: 1, minXP: 0,     title: 'Beginner' },
  { level: 2, minXP: 500,   title: 'Student'  },
  { level: 3, minXP: 1500,  title: 'Scholar'  },
  { level: 4, minXP: 3000,  title: 'Academic' },
  { level: 5, minXP: 6000,  title: 'Expert'   },
  { level: 6, minXP: 10000, title: 'Master'   },
]

export function getLevelInfo(xp: number) {
  let current = XP_LEVELS[0]
  let next = XP_LEVELS[1]
  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (xp >= XP_LEVELS[i].minXP) {
      current = XP_LEVELS[i]
      next = XP_LEVELS[i + 1] || XP_LEVELS[XP_LEVELS.length - 1]
    }
  }
  const progress = next
    ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100
  return { current, next, progress }
}
