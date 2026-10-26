'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserBadge } from '@/types'
import { getLevelInfo } from '@/types'
import { useRouter } from 'next/navigation'
import { Save, LogOut } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

interface ProfileClientProps {
  profile: Profile | null
  badges: UserBadge[]
  userId: string
  email: string
}

export default function ProfileClient({ profile, badges, userId, email }: ProfileClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const setProfile = useAppStore((s) => s.setProfile)
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    target_exam: profile?.target_exam || '',
    academic_year: profile?.academic_year || '',
    daily_goal_hours: profile?.daily_goal_hours || 4,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const levelInfo = profile ? getLevelInfo(profile.xp) : null

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ ...form, updated_at: new Date().toISOString() }).eq('id', userId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    router.push('/login')
    router.refresh()
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar + Level */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
          {form.full_name?.[0]?.toUpperCase() || form.username?.[0]?.toUpperCase() || '👤'}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{form.full_name || form.username || 'Student'}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{email}</p>
          {profile && levelInfo && (
            <div className="mt-2">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                ⚡ Level {profile.level} · {levelInfo.current.title} · {profile.xp} XP
              </p>
              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 mt-1.5 max-w-xs mx-auto sm:mx-0">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-center">
          <div>
            <p className="text-2xl font-bold text-orange-500">🔥 {profile?.streak || 0}</p>
            <p className="text-xs text-gray-400">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name</label>
              <input className={inputClass} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Username</label>
              <input className={inputClass} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="username" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Target Exam</label>
              <input className={inputClass} value={form.target_exam} onChange={(e) => setForm({ ...form, target_exam: e.target.value })} placeholder="e.g. JEE, NEET, UPSC" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Academic Year</label>
              <input className={inputClass} value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="e.g. 11th, 12th, 1st Year" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Daily Study Goal (hours)</label>
            <input
              type="number" min={1} max={16}
              className={inputClass}
              value={form.daily_goal_hours}
              onChange={(e) => setForm({ ...form, daily_goal_hours: Number(e.target.value) })}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🏆 Badges Earned ({badges.length})</h3>
        {badges.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No badges yet — complete goals and tests to earn them!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {badges.map(({ id, badges: badge, earned_at }) => (
              <div key={id} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 text-center">
                <span className="text-3xl">{badge?.icon}</span>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">{badge?.name}</p>
                <p className="text-[10px] text-gray-400">{new Date(earned_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Session / Logout */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Account Session</h4>
          <p className="text-xs text-gray-400 mt-0.5">Signed in as {email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          Sign Out of SSQuiz
        </button>
      </div>
    </div>
  )
}
