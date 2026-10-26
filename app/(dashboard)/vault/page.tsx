import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default async function VaultPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const { data: vault } = await supabase
    .from('mistake_vault')
    .select('*, questions(question, correct_ans, explanation, options, tests(title, subjects(name, icon)))')
    .eq('user_id', user.id)
    .order('next_review', { ascending: true })

  const dueToday = vault?.filter((v) => v.next_review <= today) || []
  const upcoming = vault?.filter((v) => v.next_review > today) || []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mistake Vault 🎒</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Spaced repetition — review your weak spots before they become habits
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{dueToday.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Due Today</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{upcoming.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Upcoming</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{vault?.length || 0}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total</p>
        </div>
      </div>

      {vault?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🎒</p>
          <p className="font-medium text-gray-600 dark:text-gray-400">Vault is empty!</p>
          <p className="text-sm mt-1">Wrong answers from tests are automatically saved here.</p>
          <Link href="/tests" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 text-sm hover:underline">
            Take a test →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Due Today */}
          {dueToday.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                🔴 Due for Review Today ({dueToday.length})
              </h3>
              <div className="space-y-3">
                {dueToday.map((item) => (
                  <VaultCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                📅 Upcoming Reviews ({upcoming.length})
              </h3>
              <div className="space-y-3">
                {upcoming.map((item) => (
                  <VaultCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function VaultCard({ item }: { item: any }) {
  const q = item.questions
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{q?.question}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
          <Calendar size={11} />
          {new Date(item.next_review).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {q?.tests?.subjects?.icon} {q?.tests?.subjects?.name} — {q?.tests?.title}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-medium">
          ✓ Ans: {q?.correct_ans}
        </span>
        <span className="text-xs text-gray-400">Reviewed {item.review_count}×</span>
      </div>
      {q?.explanation && (
        <p className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          💡 {q.explanation}
        </p>
      )}
    </div>
  )
}
