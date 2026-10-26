import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminClient from './AdminClient'
import type { Subject, Test } from '@/types'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Optional: If ADMIN_EMAIL is set in .env.local, restrict to that email
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail && user.email !== adminEmail) {
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
