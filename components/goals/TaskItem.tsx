'use client'

import { useState, useTransition } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { cn, getPriorityColor, getCategoryIcon } from '@/lib/utils'
import type { Task } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  const handleToggle = () => {
    startTransition(async () => {
      await supabase
        .from('tasks')
        .update({ is_complete: !task.is_complete, updated_at: new Date().toISOString() })
        .eq('id', task.id)
      onToggle(task.id)
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await supabase.from('tasks').delete().eq('id', task.id)
      onDelete(task.id)
    })
  }

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
      task.is_complete
        ? 'border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 opacity-70'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-sm'
    )}>
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={cn(
          'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
          task.is_complete
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
        )}
      >
        {task.is_complete && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>

      {/* Category icon */}
      <span className="text-base flex-shrink-0">{getCategoryIcon(task.category)}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', task.is_complete && 'line-through text-gray-400 dark:text-gray-500')}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{task.description}</p>
        )}
      </div>

      {/* Priority badge */}
      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium border flex-shrink-0', getPriorityColor(task.priority))}>
        {task.priority}
      </span>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
