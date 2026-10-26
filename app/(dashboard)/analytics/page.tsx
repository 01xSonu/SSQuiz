import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AnalyticsClient from './AnalyticsClient'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: submissions } = await supabase
    .from('submissions')
    .select('*, tests(subjects(name))')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: true })

  const subs = submissions || []

  // Accuracy over time (last 14 submissions)
  const accuracyData = subs.slice(-14).map((s) => ({
    date: s.submitted_at.split('T')[0],
    accuracy: Number(s.accuracy),
  }))

  // Subject-wise accuracy
  const subjectMap: Record<string, { total: number; count: number }> = {}
  subs.forEach((s) => {
    const name = (s.tests as any)?.subjects?.name || 'General'
    if (!subjectMap[name]) subjectMap[name] = { total: 0, count: 0 }
    subjectMap[name].total += Number(s.accuracy)
    subjectMap[name].count += 1
  })
  const subjectData = Object.entries(subjectMap).map(([subject, { total, count }]) => ({
    subject,
    accuracy: Math.round(total / count),
  }))

  const totalTests = subs.length
  const avgAccuracy = totalTests > 0 ? Math.round(subs.reduce((a, s) => a + Number(s.accuracy), 0) / totalTests) : 0
  const { data: profile } = await supabase.from('profiles').select('xp').eq('id', user.id).single()
  const bestSubject = subjectData.sort((a, b) => b.accuracy - a.accuracy)[0]?.subject || ''

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics 📊</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your performance insights</p>
      </div>
      <AnalyticsClient
        accuracyData={accuracyData}
        subjectData={subjectData}
        totalTests={totalTests}
        avgAccuracy={avgAccuracy}
        totalXP={profile?.xp || 0}
        bestSubject={bestSubject}
      />
    </div>
  )
}
