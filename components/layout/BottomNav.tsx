'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ClipboardList, BookOpen, BarChart2, Backpack } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',    icon: Home,          label: 'Home'      },
  { href: '/goals',        icon: ClipboardList, label: 'Goals'     },
  { href: '/tests',        icon: BookOpen,      label: 'Tests'     },
  { href: '/analytics',   icon: BarChart2,     label: 'Analytics' },
  { href: '/vault',        icon: Backpack,      label: 'Vault'     },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-100 select-none touch-manipulation active:scale-90 active:opacity-70',
                active
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-indigo-500'
              )}
            >
              <Icon
                size={22}
                className={cn(active && 'scale-110 transition-transform')}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className={cn('text-[10px] font-medium', active && 'font-semibold')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
