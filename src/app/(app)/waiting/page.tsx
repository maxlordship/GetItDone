import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import SimpleActionList from '@/components/actions/SimpleActionList'

export default async function WaitingPage() {
  const supabase = await createClient()
  const { data: actions } = await supabase
    .from('actions')
    .select('*, areas(name, color)')
    .eq('type', 'waiting_for')
    .eq('completed', false)
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader title="In attesa" subtitle={`${actions?.length ?? 0} elementi`} />
      <SimpleActionList
        initialActions={actions ?? []}
        emptyIcon="⏳"
        emptyText="Nessun elemento in attesa"
        showDelegatedTo
      />
    </div>
  )
}
