import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function getXPForAction(action: 'task' | 'goal' | 'test_pass' | 'streak_7'): number {
  const rewards = { task: 10, goal: 50, test_pass: 100, streak_7: 200 }
  return rewards[action]
}

export function getDifficultyColor(difficulty: string): string {
  return difficulty === 'easy'
    ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
    : difficulty === 'medium'
    ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/30'
    : 'text-red-500 bg-red-50 dark:bg-red-900/30'
}

export function getPriorityColor(priority: string): string {
  return priority === 'high'
    ? 'text-red-500 bg-red-50 dark:bg-red-900/30 border-red-200'
    : priority === 'medium'
    ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/30 border-amber-200'
    : 'text-blue-500 bg-blue-50 dark:bg-blue-900/30 border-blue-200'
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    revision: '📖',
    practice: '✏️',
    lecture: '🎧',
    other: '📌',
  }
  return icons[category] || '📌'
}
