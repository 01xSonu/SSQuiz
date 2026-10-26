'use client'

import { AccuracyChart, SubjectRadar } from '@/components/analytics/Charts'

interface AnalyticsClientProps {
  accuracyData: { date: string; accuracy: number }[]
  subjectData: { subject: string; accuracy: number }[]
  totalTests: number
  avgAccuracy: number
  totalXP: number
  bestSubject: string
}

export default function AnalyticsClient({
  accuracyData, subjectData, totalTests, avgAccuracy, totalXP, bestSubject
}: AnalyticsClientProps) {
  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Tests Taken', value: totalTests, icon: '🧪' },
          { label: 'Avg Accuracy', value: `${avgAccuracy}%`, icon: '🎯' },
          { label: 'Total XP', value: totalXP, icon: '⚡' },
          { label: 'Best Subject', value: bestSubject || '—', icon: '🏆' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <span className="text-2xl">{icon}</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Accuracy over time */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Accuracy Over Time</h3>
        {accuracyData.length < 2 ? (
          <p className="text-sm text-gray-400 text-center py-8">Take more tests to see your progress chart 📈</p>
        ) : (
          <AccuracyChart data={accuracyData} />
        )}
      </div>

      {/* Subject radar */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Accuracy</h3>
        {subjectData.length < 3 ? (
          <p className="text-sm text-gray-400 text-center py-8">Take tests in 3+ subjects to see the radar chart 🎯</p>
        ) : (
          <SubjectRadar data={subjectData} />
        )}
      </div>

      {/* Weak areas */}
      {subjectData.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📉 Weak Areas</h3>
          <div className="space-y-2">
            {[...subjectData]
              .sort((a, b) => a.accuracy - b.accuracy)
              .slice(0, 3)
              .map(({ subject, accuracy }) => (
                <div key={subject} className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{subject}</span>
                  <span className={`text-sm font-bold ${accuracy < 50 ? 'text-red-500' : 'text-amber-500'}`}>{accuracy}%</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
