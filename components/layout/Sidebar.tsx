'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home, ClipboardList, BookOpen, BarChart2,
  Backpack, User, LogOut, Zap, ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'
import { getLevelInfo } from '@/types'

const navItems = [
  { href: '/dashboard',   icon: Home,          label: 'Dashboard' },
  { href: '/goals',       icon: ClipboardList, label: 'Daily Goals' },
  { href: '/tests',       icon: BookOpen,      label: 'Tests' },
  { href: '/analytics',  icon: BarChart2,     label: 'Analytics' },
  { href: '/vault',       icon: Backpack,      label: 'Mistake Vault' },
  { href: '/profile',     icon: User,          label: 'Profile' },
]

interface SidebarProps {
  isAdmin?: boolean
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const profile = useAppStore((s) => s.profile)
  const levelInfo = profile ? getLevelInfo(profile.xp) : null

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
          <Zap size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            SS<span className="text-indigo-600">Quiz</span>
          </span>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">
            Smart Practice · Exam Prep
          </p>
        </div>
      </div>

      {/* XP Bar */}
      {profile && levelInfo && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Lv.{profile.level} {levelInfo.current.title}
            </span>
            <span className="text-xs text-gray-400">{profile.xp} XP</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/60'
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Profile + Logout */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        {profile && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {profile.full_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {profile.full_name || profile.username}
              </p>
              <p className="text-xs text-gray-400 truncate">{profile.target_exam || 'Set target exam'}</p>
            </div>
          </div>
        )}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex w-full items-center gap-2 px-3 py-2 mb-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <ShieldCheck size={16} />
            Admin Portal
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
