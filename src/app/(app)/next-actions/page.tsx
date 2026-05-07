import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import NextActionsList from './NextActionsList'

export default async function NextActionsPage() {
  const supabase = await createClient()
  const { data: actions } = await supabase
    .from('actions')
    .select('*, areas(name, color), projects(title)')
    .eq('type', 'next_action')
    .eq('completed', false)
    .order('created_at', { ascending: true })

  const { data: areas } = await supabase.from('areas').select('*').order('name')

  return (
    <div>
      <PageHeader title="Prossime azioni" subtitle={`${actions?.length ?? 0} azioni`} />
      <NextActionsList initialActions={actions ?? []} areas={areas ?? []} />
    </div>
  )
}
