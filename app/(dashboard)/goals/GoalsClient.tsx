'use client'

import { useState } from 'react'
import { Plus, Filter } from 'lucide-react'
import type { Task } from '@/types'
import TaskItem from '@/components/goals/TaskItem'
import AddTaskModal from '@/components/goals/AddTaskModal'
import GoalProgressBar from '@/components/dashboard/GoalProgressBar'

interface GoalsClientProps {
  initialTasks: Task[]
  userId: string
  dailyGoalHours: number
}

const FILTERS = ['all', 'high', 'medium', 'low'] as const
const CATEGORIES = ['all', 'revision', 'practice', 'lecture', 'other'] as const

export default function GoalsClient({ initialTasks, userId, dailyGoalHours }: GoalsClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showModal, setShowModal] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<typeof FILTERS[number]>('all')
  const [categoryFilter, setCategoryFilter] = useState<typeof CATEGORIES[number]>('all')

  const filtered = tasks.filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    return true
  })

  const completed = tasks.filter((t) => t.is_complete).length
  const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div className="space-y-5">
      <GoalProgressBar
        completed={completed}
        total={tasks.length}
        percent={percent}
        goalHours={dailyGoalHours}
      />

      {/* Filters + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
          <Filter size={14} className="text-gray-400 flex-shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setPriorityFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                priorityFilter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : `${f.charAt(0).toUpperCase() + f.slice(1)} Priority`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex-shrink-0"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              categoryFilter === c
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {c === 'all' ? '📋 All' :
             c === 'revision' ? '📖 Revision' :
             c === 'practice' ? '✏️ Practice' :
             c === 'lecture' ? '🎧 Lecture' : '📌 Other'}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm">No tasks match the filter.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
            >
              + Add a task
            </button>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={(id) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, is_complete: !t.is_complete } : t))}
              onDelete={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
            />
          ))
        )}
      </div>

      {showModal && (
        <AddTaskModal
          userId={userId}
          onAdd={(task) => setTasks((prev) => [task, ...prev])}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
