import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StatsCard from '@/components/dashboard/StatsCard'
import StreakWidget from '@/components/dashboard/StreakWidget'
import GoalProgressBar from '@/components/dashboard/GoalProgressBar'
import { getLevelInfo, isTestLocked, type Test } from '@/types'
import Link from 'next/link'
import { ArrowRight, BookOpen, ClipboardList, Lock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, tasksRes, submissionsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('tasks').select('*').eq('user_id', user.id).eq('due_date', new Date().toISOString().split('T')[0]),
    supabase.from('submissions').select('*').eq('user_id', user.id).order('submitted_at', { ascending: false }).limit(5),
  ])

  const profile = profileRes.data
  const tasks = tasksRes.data || []
  const submissions = submissionsRes.data || []

  const completedTasks = tasks.filter((t) => t.is_complete).length
  const totalTasks = tasks.length
  const goalPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const levelInfo = profile ? getLevelInfo(profile.xp) : null

  const recentTests = await supabase
    .from('tests')
    .select('*, subjects(name, icon, color)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="space-y-6">
      {/* Welcome + Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hey, {profile?.full_name?.split(' ')[0] || profile?.username || 'Student'} 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Ready to crush your goals today?
          </p>
        </div>
        <StreakWidget streak={profile?.streak || 0} />
      </div>

      {/* Daily Goal Progress */}
      <GoalProgressBar
        completed={completedTasks}
        total={totalTasks}
        percent={goalPercent}
        goalHours={profile?.daily_goal_hours || 4}
      />

      {/* XP Level */}
      {profile && levelInfo && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-indigo-100 text-sm">Level {profile.level} — {levelInfo.current.title}</p>
              <p className="text-2xl font-bold">{profile.xp} XP</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
          <div className="h-2 rounded-full bg-indigo-400/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-white/80 transition-all"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <p className="text-indigo-100 text-xs mt-1">
            {levelInfo.next?.minXP ? `${levelInfo.next.minXP - profile.xp} XP to Level ${profile.level + 1}` : 'Max Level!'}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="Tasks Today" value={`${completedTasks}/${totalTasks}`} icon="📋" color="indigo" />
        <StatsCard label="Tests Taken" value={submissions.length} icon="🧪" color="blue" />
        <StatsCard label="Streak" value={`${profile?.streak || 0}d`} icon="🔥" color="orange" />
        <StatsCard label="Level" value={`Lv.${profile?.level || 1}`} icon="⭐" color="purple" />
      </div>

      {/* Today's Tasks */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList size={16} /> Today&apos;s Tasks
          </h3>
          <Link href="/goals" className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No tasks yet. <Link href="/goals" className="text-indigo-500 hover:underline">Add one!</Link></p>
        ) : (
          <ul className="space-y-2">
            {tasks.slice(0, 4).map((task) => (
              <li key={task.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${task.is_complete ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`} />
                <span className={`text-sm flex-1 ${task.is_complete ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {task.title}
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
                  ${task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                  {task.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Tests */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen size={16} /> Quick Tests
          </h3>
          <Link href="/tests" className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(recentTests.data || []).map((test) => {
            const locked = isTestLocked(test)
            return (
              <Link
                key={test.id}
                href={`/tests/${test.id}`}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                  locked
                    ? 'border-amber-200/70 dark:border-amber-900/30 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-400'
                    : 'border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm'
                }`}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: (test.subjects?.color || '#6366f1') + '22' }}
                >
                  {test.subjects?.icon || '📚'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {test.title}
                    </p>
                    {locked && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                        <Lock size={9} /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{test.subjects?.name} • {test.duration_min}min</p>
                </div>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    test.difficulty === 'easy'
                      ? 'bg-emerald-100 text-emerald-600'
                      : test.difficulty === 'medium'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {test.difficulty}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
