import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AestheticBadge from '@/components/layout/AestheticBadge'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'SSQuiz — Smart Practice, Daily Goals & Exam Prep',
  description: 'Boost your exam performance with SSQuiz: daily goals, timed tests, performance analytics, and spaced repetition.',
  keywords: ['exam prep', 'student quiz', 'study app', 'daily goals', 'MCQ practice'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeScript />
        {children}
        <AestheticBadge />
      </body>
    </html>
  )
}

// Inline script to apply theme before hydration — prevents flash
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const s = JSON.parse(localStorage.getItem('ssquiz-store') || '{}');
            const theme = s?.state?.theme || 'light';
            document.documentElement.classList.toggle('dark', theme === 'dark');
          } catch(e) {}
        `,
      }}
    />
  )
}
