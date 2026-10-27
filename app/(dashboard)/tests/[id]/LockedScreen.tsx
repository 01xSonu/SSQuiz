'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Lock,
  ShieldAlert,
  Clock,
  BookOpen,
  RotateCw,
  ArrowLeft,
  Award,
} from 'lucide-react'
import { getDifficultyColor } from '@/lib/utils'
import type { Test } from '@/types'

interface LockedScreenProps {
  test: Test
  questionCount: number
}

export default function LockedScreen({ test, questionCount }: LockedScreenProps) {
  const router = useRouter()
  const [checking, setChecking] = useState(false)

  const handleRefresh = async () => {
    setChecking(true)
    router.refresh()
    setTimeout(() => {
      setChecking(false)
    }, 800)
  }

  return (
    <div className="max-w-2xl mx-auto my-6 space-y-6">
      <Link
        href="/tests"
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
      >
        <ArrowLeft size={16} /> Back to All Tests
      </Link>

      <div className="rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
        {/* Anti-Cheating Top Warning Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-4 shadow-lg">
              <Lock size={32} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert size={14} /> Anti-Cheating Lock Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Test Paper is Locked
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1.5 max-w-md">
              Access to this test paper is currently locked by the administrator to prevent advance viewing and unfair advantage.
            </p>
          </div>
        </div>

        {/* Test Overview Card */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{test.subjects?.icon || '📚'}</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {test.subjects?.name || 'General'}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getDifficultyColor(
                  test.difficulty
                )}`}
              >
                {test.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {test.title}
            </h3>
            {test.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {test.description}
              </p>
            )}
          </div>

          {/* Test Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <Clock size={16} className="mx-auto text-indigo-500 mb-1" />
              <p className="text-[10px] text-gray-400 font-medium">Duration</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {test.duration_min} min
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <BookOpen size={16} className="mx-auto text-indigo-500 mb-1" />
              <p className="text-[10px] text-gray-400 font-medium">Questions</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {questionCount} MCQs
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <Award size={16} className="mx-auto text-indigo-500 mb-1" />
              <p className="text-[10px] text-gray-400 font-medium">Total Marks</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {test.total_marks} pts
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <span className="text-base block mb-0.5">⏱</span>
              <p className="text-[10px] text-gray-400 font-medium">Mode</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 capitalize">
                {test.mode}
              </p>
            </div>
          </div>

          {/* Explanation Info Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-3">
            <Lock size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
              <p className="font-bold mb-0.5">When will access be opened?</p>
              <p>
                The administrator or instructor has scheduled this test. Questions and answer keys are strictly sealed.
                Once the admin clicks &quot;Allow Access / Unlock&quot; from their panel, this page will unlock and you can start the test immediately.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <Link
              href="/tests"
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Browse Other Tests
            </Link>

            <button
              onClick={handleRefresh}
              disabled={checking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-60"
            >
              <RotateCw size={14} className={checking ? 'animate-spin' : ''} />
              {checking ? 'Checking Status...' : 'Check / Refresh Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
