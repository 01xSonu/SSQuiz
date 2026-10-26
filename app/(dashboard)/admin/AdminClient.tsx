'use client'

import { useState } from 'react'
import { Plus, Trash2, ShieldCheck, Clock, BookOpen, ExternalLink, CheckCircle } from 'lucide-react'
import CreateTestModal from '@/components/tests/CreateTestModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Subject, Test } from '@/types'

interface AdminClientProps {
  tests: (Test & { question_count?: number })[]
  subjects: Subject[]
  adminEmail: string
}

export default function AdminClient({ tests: initialTests, subjects, adminEmail }: AdminClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [tests, setTests] = useState(initialTests)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to permanently delete this test and all its questions?')) return
    setDeletingId(testId)
    const { error } = await supabase.from('tests').delete().eq('id', testId)
    setDeletingId(null)
    if (!error) {
      setTests((prev) => prev.filter((t) => t.id !== testId))
      router.refresh()
    } else {
      alert('Failed to delete test: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Admin Test Management</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Owner Portal
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Only you have access to create, edit, and delete official tests & questions
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex-shrink-0"
        >
          <Plus size={16} /> Create Official Test
        </button>
      </div>

      {/* Tests Table / List */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            All Official Test Papers ({tests.length})
          </h3>
          <span className="text-xs text-gray-400">
            Stored in cloud PostgreSQL (Supabase)
          </span>
        </div>

        {tests.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📝</p>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
              No tests created yet
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-4">
              Click &quot;Create Official Test&quot; above to add your first quiz or exam paper with MCQs.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
            >
              <Plus size={14} /> Create Test
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {tests.map((test) => (
              <div
                key={test.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">
                      {test.subjects?.icon || '📚'}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {test.subjects?.name || 'General'}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                        test.difficulty === 'easy'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : test.difficulty === 'medium'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                      }`}
                    >
                      {test.difficulty}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {test.mode}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {test.title}
                  </h4>
                  {test.description && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {test.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {test.duration_min} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} /> {test.total_marks} marks
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={12} /> Live / Published
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/tests/${test.id}`}
                    target="_blank"
                    className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
                    title="Preview test interface"
                  >
                    <ExternalLink size={16} />
                  </Link>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    disabled={deletingId === test.id}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete test paper"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTestModal
          subjects={subjects}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
