import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import CalendarView from './CalendarView'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: actions } = await supabase
    .from('actions')
    .select('*, areas(name, color), projects(title)')
    .eq('type', 'scheduled')
    .eq('completed', false)
    .not('scheduled_at', 'is', null)
    .order('scheduled_at', { ascending: true })

  return (
    <div>
      <PageHeader title="Calendario" subtitle="Azioni pianificate" />
      <CalendarView actions={actions ?? []} />
    </div>
  )
}
