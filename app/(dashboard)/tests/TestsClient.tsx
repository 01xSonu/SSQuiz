'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ChevronRight, Lock, Unlock, ShieldAlert } from 'lucide-react'
import { getDifficultyColor } from '@/lib/utils'
import { isTestLocked, type Subject, type Test } from '@/types'

interface TestsClientProps {
  initialTests: Test[]
  subjects: Subject[]
  isAdmin?: boolean
}

export default function TestsClient({ initialTests, subjects, isAdmin = false }: TestsClientProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  const countLocked = initialTests.filter((t) => isTestLocked(t)).length
  const countUnlocked = initialTests.length - countLocked

  const filteredTests = initialTests.filter((test) => {
    const matchesSubject = selectedSubject === 'all' || test.subject_id === selectedSubject
    const locked = isTestLocked(test)
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'unlocked'
        ? !locked
        : locked
    return matchesSubject && matchesStatus
  })

  const testsBySubject = subjects
    .map((sub) => ({
      ...sub,
      tests: filteredTests.filter((t) => t.subject_id === sub.id),
    }))
    .filter((s) => s.tests.length > 0)

  return (
    <div>
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Test Papers 🧪</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Select a subject to practice. Locked tests are protected until unlocked by the instructor.
          </p>
        </div>

        {/* Status Filter (All / Ready to Give / Locked) */}
        <div className="inline-flex p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 self-start sm:self-center">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All ({initialTests.length})
          </button>
          <button
            onClick={() => setStatusFilter('unlocked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              statusFilter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Unlock size={12} /> Open ({countUnlocked})
          </button>
          <button
            onClick={() => setStatusFilter('locked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              statusFilter === 'locked'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Lock size={12} /> Locked ({countLocked})
          </button>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedSubject === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-indigo-300'
          }`}
        >
          <span>📚</span> All Subjects
        </button>
        {subjects.map((sub) => {
          const count = initialTests.filter((t) => t.subject_id === sub.id).length
          const active = selectedSubject === sub.id
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-indigo-300'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.name}</span>
              <span className="text-[10px] ml-0.5 opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Grouped Tests Catalog */}
      <div className="space-y-8">
        {testsBySubject.map(({ id, name, icon, color, tests: subTests }) => (
          <section key={id}>
            <div className="flex items-center gap-2.5 mb-3.5">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-sm"
                style={{ backgroundColor: color + '22' }}
              >
                {icon}
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">{name}</h3>
              <span className="text-xs text-gray-400 font-medium">({subTests.length} tests)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {subTests.map((test) => {
                const locked = isTestLocked(test)
                return (
                  <Link
                    key={test.id}
                    href={`/tests/${test.id}`}
                    className={`group rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                      locked
                        ? 'border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-400 dark:hover:border-amber-700 hover:shadow-md'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4
                          className={`font-semibold text-sm leading-snug transition-colors ${
                            locked
                              ? 'text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400'
                              : 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        >
                          {test.title}
                        </h4>
                        {locked ? (
                          <span title="Locked by Admin">
                            <Lock
                              size={15}
                              className="text-amber-500 mt-0.5 flex-shrink-0"
                            />
                          </span>
                        ) : (
                          <ChevronRight
                            size={15}
                            className="text-gray-300 group-hover:text-indigo-500 mt-0.5 flex-shrink-0 transition-all group-hover:translate-x-0.5"
                          />
                        )}
                      </div>
                      {test.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3.5 line-clamp-2 leading-relaxed">
                          {test.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getDifficultyColor(
                              test.difficulty
                            )}`}
                          >
                            {test.difficulty}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                            <Clock size={11} /> {test.duration_min}m
                          </span>
                        </div>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          {test.mode === 'mock'
                            ? '🎯 Mock'
                            : test.mode === 'instant'
                            ? '⚡ Instant'
                            : '⏱ Timed'}
                        </span>
                      </div>

                      {/* Lock Status Footer Indicator */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-dashed border-gray-100 dark:border-gray-800 text-[11px]">
                        {locked ? (
                          <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                            <Lock size={11} />
                            {isAdmin ? 'Locked (Admin Preview)' : 'Locked • Opens When Admin Unlocks'}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <Unlock size={11} />
                            Ready to Give • Click to Start
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {test.total_marks} marks
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Empty State */}
      {filteredTests.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
          <p className="text-5xl mb-3">
            {statusFilter === 'locked' ? '🔒' : '🧪'}
          </p>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            {statusFilter === 'locked'
              ? 'No locked tests found'
              : statusFilter === 'unlocked'
              ? 'No unlocked tests available right now'
              : 'No tests available in this category yet'}
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {statusFilter === 'locked'
              ? 'All test papers are currently unlocked and accessible to students.'
              : 'Please check back soon or switch filters to view all test papers.'}
          </p>
        </div>
      )}
    </div>
  )
}
