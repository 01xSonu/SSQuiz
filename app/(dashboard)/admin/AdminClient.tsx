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
  FileText,
  Users,
  Search,
  Award,
  TrendingUp,
} from 'lucide-react'
import CreateTestModal from '@/components/tests/CreateTestModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isTestLocked, type Subject, type Test, type Submission } from '@/types'
import { formatDate, formatDuration } from '@/lib/utils'

interface AdminClientProps {
  tests: (Test & { question_count?: number })[]
  subjects: Subject[]
  submissions?: (Submission & {
    profiles?: { full_name: string | null; username: string; avatar_url: string | null }
  })[]
  adminEmail: string
}

export default function AdminClient({
  tests: initialTests,
  subjects,
  submissions = [],
  adminEmail,
}: AdminClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [tests, setTests] = useState(initialTests)
  const [activeTab, setActiveTab] = useState<'tests' | 'submissions'>('tests')
  const [submissionSearch, setSubmissionSearch] = useState('')
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'tests'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <FileText size={16} /> Official Tests ({tests.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Users size={16} /> Student Submissions & Scores ({submissions.length})
        </button>
      </div>

      {activeTab === 'tests' ? (
        /* Tests Table / List */
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                All Official Test Papers ({tests.length})
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Newly uploaded tests are locked by default to prevent cheating. Click &quot;Allow Student Access&quot; when the exam begins.
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
      ) : (
        /* Student Submissions & Scores View */
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span>Total Attempts</span>
                <Users size={16} className="text-indigo-500" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {submissions.length}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span>Average Accuracy</span>
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {submissions.length > 0
                  ? Math.round(
                      submissions.reduce((a, b) => a + Number(b.accuracy || 0), 0) /
                        submissions.length
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span>Total Scored Points</span>
                <Award size={16} className="text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {submissions.reduce((a, b) => a + (b.score || 0), 0)} pts
              </p>
            </div>
          </div>

          {/* Submissions Table Card */}
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  Student Test Attempts & Scores ({submissions.length})
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Live scores and attempt details submitted by students
                </p>
              </div>

              {submissions.length > 0 && (
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search student or test..."
                    value={submissionSearch}
                    onChange={(e) => setSubmissionSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:border-indigo-500 w-full sm:w-60"
                  />
                </div>
              )}
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">🎓</p>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  No student attempts yet
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  When students unlock and submit tests, their scores, accuracy, and detailed results will appear here automatically!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="p-4">Student</th>
                      <th className="p-4">Test Paper</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Accuracy</th>
                      <th className="p-4">Time Spent</th>
                      <th className="p-4">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {submissions
                      .filter((s) => {
                        const q = submissionSearch.toLowerCase().trim()
                        if (!q) return true
                        const studentName = (
                          s.profiles?.full_name ||
                          s.profiles?.username ||
                          ''
                        ).toLowerCase()
                        const testTitle = ((s.tests as any)?.title || '').toLowerCase()
                        return studentName.includes(q) || testTitle.includes(q)
                      })
                      .map((sub) => {
                        const studentName =
                          sub.profiles?.full_name || sub.profiles?.username || 'Student'
                        const initial = studentName.charAt(0).toUpperCase()
                        return (
                          <tr
                            key={sub.id}
                            className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {initial}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {studentName}
                                  </p>
                                  {sub.profiles?.username && (
                                    <p className="text-[10px] text-gray-400">
                                      @{sub.profiles.username}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {(sub.tests as any)?.title || 'Test Paper'}
                              </p>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-gray-900 dark:text-white">
                                {sub.score} / {sub.total}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  Number(sub.accuracy) >= 75
                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                    : Number(sub.accuracy) >= 50
                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                    : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                                }`}
                              >
                                {sub.accuracy}%
                              </span>
                            </td>
                            <td className="p-4 text-gray-500 dark:text-gray-400">
                              {sub.time_taken ? formatDuration(sub.time_taken) : '—'}
                            </td>
                            <td className="p-4 text-gray-400 text-[11px]">
                              {sub.submitted_at ? formatDate(sub.submitted_at) : '—'}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

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
