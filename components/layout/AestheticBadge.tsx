'use client'

import { useState } from 'react'
import { Sparkles, Moon, Sun } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export default function AestheticBadge() {
  const [isHovered, setIsHovered] = useState(false)
  const { theme, toggleTheme } = useAppStore()

  return (
    <div
      className="fixed bottom-5 left-5 z-50 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center">
        {/* Glow effect behind the badge */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-md group-hover:opacity-75 transition duration-500 group-hover:scale-105" />

        {/* Main Badge Container */}
        <div className="relative flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/50 dark:border-gray-800/80 shadow-xl shadow-indigo-500/10 transition-all duration-300">
          {/* Aesthetic Logo Icon */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 shadow-md shadow-indigo-500/30 text-white">
            <Sparkles size={16} className="animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          {/* Text and Branding */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                SSQuiz
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5 font-medium">
              Smart Prep
            </span>
          </div>

          {/* Quick Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="ml-1 p-1.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 dark:hover:text-indigo-300 transition-colors"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
