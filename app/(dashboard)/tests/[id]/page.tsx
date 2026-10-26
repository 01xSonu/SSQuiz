import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import TestInterface from './TestInterface'
import { Clock, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getDifficultyColor } from '@/lib/utils'

export default async function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [testRes, questionsRes] = await Promise.all([
    supabase.from('tests').select('*, subjects(name, icon, color)').eq('id', id).single(),
    supabase.from('questions').select('*').eq('test_id', id).order('order_num'),
  ])

  if (!testRes.data) notFound()

  const test = testRes.data
  const questions = questionsRes.data || []

  return (
    <div>
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
