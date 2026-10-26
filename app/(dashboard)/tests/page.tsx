import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TestsClient from './TestsClient'
import type { Subject, Test } from '@/types'

export default async function TestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [testsRes, subjectsRes] = await Promise.all([
    supabase
      .from('tests')
      .select('*, subjects(name, icon, color)')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase.from('subjects').select('*').order('name'),
  ])

  const tests = (testsRes.data || []) as Test[]
  const subjects = (subjectsRes.data || []) as Subject[]

  return <TestsClient initialTests={tests} subjects={subjects} />
}
