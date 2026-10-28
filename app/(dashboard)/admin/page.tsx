import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'
import { isAdminUser } from '@/lib/auth/isAdmin'
import type { Subject, Test, Submission } from '@/types'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check admin authorization via helper (matches sonukr99770@gmail.com and ADMIN_EMAIL)
  if (!isAdminUser(user.email)) {
    redirect('/dashboard')
  }

  const [testsRes, subjectsRes, submissionsRes] = await Promise.all([
    supabase
      .from('tests')
      .select('*, subjects(name, icon, color)')
      .order('created_at', { ascending: false }),
    supabase.from('subjects').select('*').order('name'),
    supabase
      .from('submissions')
      .select('*, profiles(full_name, username, avatar_url), tests(title, difficulty, total_marks)')
      .order('submitted_at', { ascending: false })
      .limit(100),
  ])

  const tests = (testsRes.data || []) as Test[]
  const subjects = (subjectsRes.data || []) as Subject[]
  const submissions = (submissionsRes.data || []) as (Submission & {
    profiles?: { full_name: string | null; username: string; avatar_url: string | null }
  })[]

  return (
    <AdminClient
      tests={tests}
      subjects={subjects}
      submissions={submissions}
      adminEmail={user.email || ''}
    />
  )
}
