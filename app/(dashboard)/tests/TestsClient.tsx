'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'
import { getDifficultyColor } from '@/lib/utils'
import type { Subject, Test } from '@/types'

interface TestsClientProps {
  initialTests: Test[]
  subjects: Subject[]
}

export default function TestsClient({ initialTests, subjects }: TestsClientProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  const filteredTests = selectedSubject === 'all'
    ? initialTests
    : initialTests.filter((t) => t.subject_id === selectedSubject)

  const testsBySubject = subjects
    .map((sub) => ({
      ...sub,
      tests: filteredTests.filter((t) => t.subject_id === sub.id),
    }))
    .filter((s) => s.tests.length > 0)

  return (
    <div>
      {/* Top Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Test Papers 🧪</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Select a subject to start practicing timed MCQs and mock exams
        </p>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedSubject === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-indigo-300'
          }`}
        >
          <span>📚</span> All Subjects ({initialTests.length})
        </button>
        {subjects.map((sub) => {
          const count = initialTests.filter((t) => t.subject_id === sub.id).length
          const active = selectedSubject === sub.id
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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
              {subTests.map((test) => (
                <Link
                  key={test.id}
                  href={`/tests/${test.id}`}
                  className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {test.title}
                      </h4>
                      <ChevronRight
                        size={15}
                        className="text-gray-300 group-hover:text-indigo-500 mt-0.5 flex-shrink-0 transition-all group-hover:translate-x-0.5"
                      />
                    </div>
                    {test.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3.5 line-clamp-2 leading-relaxed">
                        {test.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                        <Clock size={11} /> {test.duration_min}m
                      </span>
                    </div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {test.mode === 'mock' ? '🎯 Mock' : test.mode === 'instant' ? '⚡ Instant' : '⏱ Timed'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty State for students */}
      {filteredTests.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
          <p className="text-5xl mb-3">🧪</p>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            No tests available in this subject yet
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            New test papers are added regularly. Please check back soon or try another subject!
          </p>
        </div>
      )}
    </div>
  )
}
