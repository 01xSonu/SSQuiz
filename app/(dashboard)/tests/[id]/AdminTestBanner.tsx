'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Unlock, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isTestLocked, type Test } from '@/types'

interface AdminTestBannerProps {
  test: Test
}

export default function AdminTestBanner({ test: initialTest }: AdminTestBannerProps) {
  const router = useRouter()
  const supabase = createClient()
  const [test, setTest] = useState(initialTest)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const locked = isTestLocked(test)

  const handleToggle = async () => {
    const newLocked = !locked
    const actionLabel = newLocked ? 'Lock' : 'Unlock'

    if (
      !confirm(
        `Are you sure you want to ${actionLabel.toLowerCase()} "${test.title}"?\n\n` +
          (newLocked
            ? 'Students will be immediately blocked from accessing questions.'
            : 'All students will now be allowed to view and take this test.')
      )
    ) {
      return
    }

    setLoading(true)

    // Optimistic UI state
    setTest((prev) => ({ ...prev, is_locked: newLocked, is_published: true }))

    let { error } = await supabase
      .from('tests')
      .update({ is_locked: newLocked, is_published: true })
      .eq('id', test.id)

    // Fallback if is_locked column is pending migration 004
    if (error && (error.message?.includes('is_locked') || (error as any).code === '42703')) {
      const fallbackRes = await supabase
        .from('tests')
        .update({ is_published: !newLocked })
        .eq('id', test.id)
      error = fallbackRes.error
    }

    setLoading(false)

    if (error) {
      // Revert optimistic update
      setTest(initialTest)
      alert('Failed to update lock state: ' + error.message)
    } else {
      setToast(
        newLocked
          ? '🔒 Test locked! Student access has been restricted.'
          : '🔓 Test unlocked! Any student can now access and take this test.'
      )
      setTimeout(() => setToast(null), 5000)
      router.refresh()
    }
  }

  return (
    <div className="mb-6 space-y-2">
      <div
        className={`rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm transition-all ${
          locked
            ? 'bg-amber-500/10 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
            : 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              locked
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {locked ? <Lock size={20} /> : <Unlock size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                {locked ? 'Admin Preview — Test is LOCKED' : 'Live Mode — Test is UNLOCKED'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-indigo-600 text-white">
                Admin Controls
              </span>
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              {locked
                ? 'Anti-cheating mode is active. Only you can preview questions. Students see a locked waiting screen.'
                : 'This test is open. Any student can currently view questions and submit their answers.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer disabled:opacity-60 ${
            locked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
          }`}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : locked ? (
            <>
              <Unlock size={14} /> Unlock for Students Now
            </>
          ) : (
            <>
              <Lock size={14} /> Lock Test Paper
            </>
          )}
        </button>
      </div>

      {toast && (
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
