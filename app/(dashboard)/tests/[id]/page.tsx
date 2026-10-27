import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import TestInterface from './TestInterface'
import LockedScreen from './LockedScreen'
import AdminTestBanner from './AdminTestBanner'
import { Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getDifficultyColor } from '@/lib/utils'
import { isAdminUser } from '@/lib/auth/isAdmin'
import { isTestLocked, type Test, type Question } from '@/types'

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isAdmin = isAdminUser(user.email)

  // 1. Fetch test details
  const { data: testData } = await supabase
    .from('tests')
    .select('*, subjects(name, icon, color)')
    .eq('id', id)
    .single()

  if (!testData) notFound()

  const test = testData as Test
  const isLocked = isTestLocked(test)

  // 2. Anti-cheating security check:
  // If the test is locked AND the user is NOT an admin, NEVER fetch or expose questions
  if (isLocked && !isAdmin) {
    const countRes = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('test_id', id)

    const questionCount = countRes.count || test.total_marks || 0
    return <LockedScreen test={test} questionCount={questionCount} />
  }

  // 3. User is authorized (either test is unlocked, or user is an admin)
  const questionsRes = await supabase
    .from('questions')
    .select('*')
    .eq('test_id', id)
    .order('order_num')

  const questions = (questionsRes.data || []) as Question[]

  return (
    <div>
      {/* Admin security control bar */}
      {isAdmin && <AdminTestBanner test={test} />}

      <div className="mb-6">
        <Link href="/tests" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Tests
        </Link>
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{test.title}</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-sm text-gray-500">
                {test.subjects?.icon} {test.subjects?.name}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(test.difficulty)}`}>
                {test.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} /> {test.duration_min} min
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <BookOpen size={12} /> {questions.length} questions
              </span>
            </div>
          </div>
        </div>
        {test.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{test.description}</p>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>No questions added to this test yet.</p>
        </div>
      ) : (
        <TestInterface test={test} questions={questions} userId={user.id} />
      )}
    </div>
  )
}
