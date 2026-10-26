'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export default function ThemeWatcher() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isDark = theme === 'dark'
      document.documentElement.classList.toggle('dark', isDark)
    }
  }, [theme])

  return null
}
