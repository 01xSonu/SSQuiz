import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TestsClient from './TestsClient'
import { isAdminUser } from '@/lib/auth/isAdmin'
import type { Subject, Test } from '@/types'

export default async function TestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isAdmin = isAdminUser(user.email)

  let testsQuery = supabase
    .from('tests')
    .select('*, subjects(name, icon, color)')
    .order('created_at', { ascending: false })

  if (!isAdmin) {
    testsQuery = testsQuery.eq('is_published', true)
  }

  const [testsRes, subjectsRes] = await Promise.all([
    testsQuery,
    supabase.from('subjects').select('*').order('name'),
  ])

  const tests = (testsRes.data || []) as Test[]
  const subjects = (subjectsRes.data || []) as Subject[]

  return <TestsClient initialTests={tests} subjects={subjects} isAdmin={isAdmin} />
}
