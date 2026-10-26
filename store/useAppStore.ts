import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Task } from '@/types'

interface AppState {
  profile: Profile | null
  tasks: Task[]
  theme: 'light' | 'dark'
  setProfile: (profile: Profile | null) => void
  setTasks: (tasks: Task[]) => void
  toggleTask: (id: string) => void
  addTask: (task: Task) => void
  removeTask: (id: string) => void
  toggleTheme: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      tasks: [],
      theme: 'light',

      setProfile: (profile) => set({ profile }),
      setTasks: (tasks) => set({ tasks }),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, is_complete: !t.is_complete } : t
          ),
        })),

      addTask: (task) =>
        set((state) => ({ tasks: [task, ...state.tasks] })),

      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light'
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark')
          }
          return { theme: next }
        }),
    }),
    { name: 'ssquiz-store', partialize: (s) => ({ theme: s.theme }) }
  )
)
