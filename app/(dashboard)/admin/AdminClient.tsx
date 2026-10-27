'use client'

import { useState } from 'react'
import {
  Plus,
  Trash2,
  ShieldCheck,
  Clock,
  BookOpen,
  ExternalLink,
  Lock,
  Unlock,
  Loader2,
  Info,
  CheckCircle2,
} from 'lucide-react'
import CreateTestModal from '@/components/tests/CreateTestModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isTestLocked, type Subject, type Test } from '@/types'

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
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const lockedCount = tests.filter((t) => isTestLocked(t)).length
  const unlockedCount = tests.length - lockedCount

  const handleToggleLock = async (test: Test) => {
    const currentlyLocked = isTestLocked(test)
    const newLocked = !currentlyLocked
    const actionName = newLocked ? 'Lock' : 'Unlock'

    if (
      !confirm(
        `Are you sure you want to ${actionName.toLowerCase()} "${test.title}"?\n\n` +
          (newLocked
            ? '🔒 Locked mode prevents students from opening or viewing questions (anti-cheating).'
            : '🔓 Unlocked mode gives all students access to start and submit this test.')
      )
    ) {
      return
    }

    setTogglingId(test.id)

    // Optimistic state update
    setTests((prev) =>
      prev.map((t) =>
        t.id === test.id
          ? { ...t, is_locked: newLocked, is_published: true }
          : t
      )
    )

    // Supabase update
    let { error } = await supabase
      .from('tests')
      .update({ is_locked: newLocked, is_published: true })
      .eq('id', test.id)

    // Fallback if is_locked column is not yet applied to database
    if (error && (error.message?.includes('is_locked') || (error as any).code === '42703')) {
      const fallbackRes = await supabase
        .from('tests')
        .update({ is_published: !newLocked })
        .eq('id', test.id)
      error = fallbackRes.error
    }

    setTogglingId(null)

    if (error) {
      // Revert optimistic update
      setTests((prev) => prev.map((t) => (t.id === test.id ? test : t)))
      alert('Failed to update lock status: ' + error.message)
    } else {
      setStatusMessage(
        newLocked
          ? `🔒 "${test.title}" is now locked. Student access has been restricted to prevent cheating.`
          : `🔓 "${test.title}" is now unlocked! All students can access and give this test.`
      )
      setTimeout(() => setStatusMessage(null), 6000)
      router.refresh()
    }
  }

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

      {/* Toast Notification */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 flex items-center justify-between text-sm shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tests Table / List */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              All Official Test Papers ({tests.length})
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Newly uploaded tests are locked by default to prevent cheating. Click &quot;Allow Access&quot; when the exam begins.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800/60">
              <Lock size={11} /> {lockedCount} Locked
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800/60">
              <Unlock size={11} /> {unlockedCount} Live
            </span>
          </div>
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
            {tests.map((test) => {
              const locked = isTestLocked(test)
              return (
                <div
                  key={test.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                      {locked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Lock size={10} className="text-amber-600 dark:text-amber-400" />
                          Locked for Students
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <Unlock size={10} className="text-emerald-600 dark:text-emerald-400" />
                          Live & Accessible
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      {test.title}
                    </h4>
                    {test.description && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {test.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {test.duration_min} minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} /> {test.total_marks} marks
                      </span>
                      {locked ? (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                          <Lock size={12} /> Cheating Protected (Students cannot access)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 size={12} /> Open for All Students
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0">
                    {/* Toggle Lock / Unlock Button */}
                    <button
                      onClick={() => handleToggleLock(test)}
                      disabled={togglingId === test.id}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        locked
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                          : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                      title={locked ? 'Allow students to take this test' : 'Lock test to prevent cheating'}
                    >
                      {togglingId === test.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : locked ? (
                        <>
                          <Unlock size={14} /> Allow Student Access
                        </>
                      ) : (
                        <>
                          <Lock size={14} /> Lock Test Paper
                        </>
                      )}
                    </button>

                    <Link
                      href={`/tests/${test.id}`}
                      target="_blank"
                      className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
                      title="Preview test interface as Admin"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteTest(test.id)}
                      disabled={deletingId === test.id}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Delete test paper"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
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
