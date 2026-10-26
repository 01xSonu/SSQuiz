'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Test, Question } from '@/types'
import { formatDuration } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bookmark,
  RotateCcw,
  Send,
  HelpCircle
} from 'lucide-react'

interface TestInterfaceProps {
  test: Test
  questions: Question[]
  userId: string
}

export default function TestInterface({ test, questions, userId }: TestInterfaceProps) {
  const router = useRouter()
  const supabase = createClient()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flagged, setFlagged] = useState<Record<string, boolean>>({})
  const [current, setCurrent] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ score: number; total: number; accuracy: number } | null>(null)
  const [timeLeft, setTimeLeft] = useState(test.duration_min * 60)
  const [showExplanation, setShowExplanation] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer for timed / mock modes
  useEffect(() => {
    if (test.mode === 'instant' || submitted) return
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted])

  // Select an option (never forces auto-jumping, student is in full control)
  const handleSelect = (questionId: string, option: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  // Clear selected answer
  const handleClearAnswer = (questionId: string) => {
    if (submitted) return
    setAnswers((prev) => {
      const next = { ...prev }
      delete next[questionId]
      return next
    })
  }

  // Toggle flag / bookmark to revisit later
  const handleToggleFlag = (questionId: string) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const handleSubmit = useCallback(async () => {
    if (submitted) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    setSubmitted(true)

    let score = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_ans) score += q.marks
    })
    const total = questions.reduce((acc, q) => acc + q.marks, 0)
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0

    setResult({ score, total, accuracy })

    // Save submission
    const timeTaken = test.duration_min * 60 - timeLeft
    await supabase.from('submissions').insert({
      user_id: userId,
      test_id: test.id,
      answers,
      score,
      total,
      accuracy,
      time_taken: timeTaken,
    })

    // Add wrong answers to mistake vault
    const wrongQuestionIds = questions
      .filter((q) => answers[q.id] && answers[q.id] !== q.correct_ans)
      .map((q) => q.id)

    if (wrongQuestionIds.length > 0) {
      await Promise.all(
        wrongQuestionIds.map((qid) =>
          supabase.from('mistake_vault').upsert(
            {
              user_id: userId,
              question_id: qid,
              next_review: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            },
            { onConflict: 'user_id,question_id' }
          )
        )
      )
    }

    // Award XP
    if (accuracy >= 60) {
      try {
        await supabase.rpc('increment_xp', { user_id: userId, amount: 100 })
      } catch {
        /* XP optional */
      }
    }
  }, [submitted, questions, answers, test, timeLeft, userId, supabase])

  const q = questions[current]
  const answeredCount = Object.keys(answers).length
  const flaggedCount = Object.values(flagged).filter(Boolean).length
  const unattemptedCount = questions.length - answeredCount
  const progressPct = Math.round((answeredCount / questions.length) * 100)

  if (!q) return null

  // ══════════════════════════════════════════════════════════════════════
  // RESULTS SCREEN (AFTER SUBMISSION)
  // ══════════════════════════════════════════════════════════════════════
  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Score card */}
        <div
          className={`rounded-3xl p-8 text-white text-center shadow-xl ${
            result.accuracy >= 80
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
              : result.accuracy >= 60
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
              : 'bg-gradient-to-br from-amber-500 to-orange-600'
          }`}
        >
          <div className="text-5xl mb-2">
            {result.accuracy >= 80 ? '🏆' : result.accuracy >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-4xl font-extrabold mb-1">{result.accuracy}%</h2>
          <p className="text-white/90 font-medium">
            {result.score} / {result.total} Marks Obtained
          </p>
          <p className="text-white/70 text-xs mt-1 font-medium">{test.title}</p>
          {result.accuracy >= 60 && (
            <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
              ⚡ +100 XP Earned!
            </div>
          )}
        </div>

        {/* Detailed Solutions & Q&A Review */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
            Detailed Solution & Review
          </h3>
          {questions.map((question, idx) => {
            const userAns = answers[question.id]
            const correct = userAns === question.correct_ans
            const skipped = !userAns
            return (
              <div
                key={question.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  {skipped ? (
                    <AlertCircle size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  ) : correct ? (
                    <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Q{idx + 1}. {question.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(question.options).map(([key, val]) => (
                    <div
                      key={key}
                      className={`text-xs px-3.5 py-2.5 rounded-xl border transition-colors ${
                        key === question.correct_ans
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                          : key === userAns && !correct
                          ? 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                          : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <span className="font-bold mr-1.5">{key}.</span> {val}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div>
                    <button
                      onClick={() =>
                        setShowExplanation(showExplanation === question.id ? null : question.id)
                      }
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      <HelpCircle size={13} />
                      {showExplanation === question.id ? 'Hide Solution' : 'View Step-by-Step Solution'}
                    </button>
                    {showExplanation === question.id && (
                      <div className="mt-2 p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                        <span className="font-bold block mb-1">💡 Solution:</span>
                        {question.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Back and Review Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => router.push('/tests')}
            className="flex-1 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ← Back to Tests
          </button>
          <button
            onClick={() => router.push('/vault')}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-colors"
          >
            Review Mistake Vault 🎒
          </button>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════
  // ACTIVE TEST TAKING INTERFACE
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* 1. Header Bar: Question Counter & Timer */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            Question {current + 1} <span className="text-gray-400 font-normal">of {questions.length}</span>
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
            {q.marks} Mark{q.marks > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {test.mode !== 'instant' && (
            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-sm ${
                timeLeft < 60
                  ? 'text-red-600 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 animate-pulse'
                  : 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60'
              }`}
            >
              <Clock size={14} />
              {formatDuration(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 2. Main Question Card */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-7 shadow-sm space-y-6">
        {/* Question Header & Bookmark / Revisit Flag */}
        <div className="flex items-start justify-between gap-4">
          <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
            {q.question}
          </p>

          <button
            type="button"
            onClick={() => handleToggleFlag(q.id)}
            title={flagged[q.id] ? 'Remove bookmark' : 'Bookmark to revisit later'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              flagged[q.id]
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-400'
                : 'border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-amber-500 hover:border-amber-400'
            }`}
          >
            <Bookmark size={14} className={flagged[q.id] ? 'fill-white' : ''} />
            <span className="hidden sm:inline">{flagged[q.id] ? 'Flagged' : 'Flag'}</span>
          </button>
        </div>

        {/* MCQ Option Buttons */}
        <div className="space-y-3">
          {Object.entries(q.options).map(([key, value]) => {
            const isSelected = answers[q.id] === key
            const isInstant = test.mode === 'instant'
            const isCorrect = isInstant && isSelected && key === q.correct_ans
            const isWrong = isInstant && isSelected && key !== q.correct_ans

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelect(q.id, key)}
                className={`w-full text-left px-4 sm:px-5 py-3.5 rounded-2xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-3.5 ${
                  isCorrect
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                    : isWrong
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 shadow-sm'
                    : isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {key}
                </span>
                <span className="flex-1 leading-snug">{value}</span>
                {isSelected && (
                  <CheckCircle size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        {/* Action Row: Clear Answer & Instant Feedback Solution */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
          {answers[q.id] ? (
            <button
              type="button"
              onClick={() => handleClearAnswer(q.id)}
              className="text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} /> Clear answer
            </button>
          ) : (
            <span className="text-gray-400 italic">Select an option to answer</span>
          )}

          {test.mode === 'instant' && answers[q.id] && q.explanation && (
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              💡 {answers[q.id] === q.correct_ans ? 'Correct!' : `Correct Answer is ${q.correct_ans}`}
            </span>
          )}
        </div>

        {test.mode === 'instant' && answers[q.id] && q.explanation && (
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200">
            <span className="font-bold block mb-1">Explanation:</span>
            {q.explanation}
          </div>
        )}
      </div>

      {/* 3. Primary Navigation Row (High Contrast & Visible) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-bold text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-indigo-400 disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft size={18} /> Prev
        </button>

        {/* Revisit indicator */}
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block text-center">
          Tap any number below to jump & revisit
        </div>

        {/* Next / Submit Button (Bright High Contrast Indigo with White Text) */}
        {current < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Send size={16} /> Submit Test
          </button>
        )}
      </div>

      {/* 4. Complete Question Navigator Palette (Easy Revisit for Students) */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Question Navigator ({questions.length} questions)
          </h4>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {answeredCount} Answered
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> {flaggedCount} Flagged
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" /> {unattemptedCount} Left
            </span>
          </div>
        </div>

        {/* Large, Tap-Friendly Question Grid */}
        <div className="flex flex-wrap gap-2 pt-1">
          {questions.map((question, idx) => {
            const isCurrent = idx === current
            const isAnswered = Boolean(answers[question.id])
            const isFlagged = Boolean(flagged[question.id])

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrent(idx)}
                title={`Jump to Question ${idx + 1}${isFlagged ? ' (Flagged)' : ''}${isAnswered ? ' (Answered)' : ''}`}
                className={`relative w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-500/30 scale-105 z-10'
                    : isFlagged
                    ? 'bg-amber-500 text-white shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400'
                }`}
              >
                {idx + 1}
                {isFlagged && !isCurrent && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 border border-white" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
