import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Daily reset: rollover tasks, update streaks
// Triggered by Vercel Cron at midnight: 0 0 * * *
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createClient()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yday = yesterday.toISOString().split('T')[0]
  const today = new Date().toISOString().split('T')[0]

  // Rollover incomplete tasks that have rollover=true
  const { data: rolloverTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('due_date', yday)
    .eq('is_complete', false)
    .eq('rollover', true)

  if (rolloverTasks && rolloverTasks.length > 0) {
    await supabase.from('tasks').insert(
      rolloverTasks.map(({ id, created_at, updated_at, ...task }) => ({
        ...task,
        due_date: today,
        is_complete: false,
      }))
    )
  }

  return NextResponse.json({ ok: true, rolledOver: rolloverTasks?.length || 0 })
}
