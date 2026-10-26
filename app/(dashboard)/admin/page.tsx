import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'
import { isAdminUser } from '@/lib/auth/isAdmin'
import type { Subject, Test } from '@/types'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check admin authorization via helper (matches sonukr99770@gmail.com and ADMIN_EMAIL)
  if (!isAdminUser(user.email)) {
    redirect('/dashboard')
  }

  const [testsRes, subjectsRes] = await Promise.all([
    supabase
      .from('tests')
      .select('*, subjects(name, icon, color)')
      .order('created_at', { ascending: false }),
    supabase.from('subjects').select('*').order('name'),
  ])

  const tests = (testsRes.data || []) as Test[]
  const subjects = (subjectsRes.data || []) as Subject[]

  return (
    <AdminClient
      tests={tests}
      subjects={subjects}
      adminEmail={user.email || ''}
    />
  )
}
