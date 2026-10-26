import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GoalsClient from './GoalsClient'

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [tasksRes, profileRes] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('due_date', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('daily_goal_hours').eq('id', user.id).single(),
  ])

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Goals 📋</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>
      <GoalsClient
        initialTasks={tasksRes.data || []}
        userId={user.id}
        dailyGoalHours={profileRes.data?.daily_goal_hours || 4}
      />
    </div>
  )
}
