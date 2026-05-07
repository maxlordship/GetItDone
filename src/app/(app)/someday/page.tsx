import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import SimpleActionList from '@/components/actions/SimpleActionList'

export default async function SomedayPage() {
  const supabase = await createClient()
  const { data: actions } = await supabase
    .from('actions')
    .select('*, areas(name, color)')
    .eq('type', 'someday_maybe')
    .eq('completed', false)
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader title="Prima o poi" subtitle={`${actions?.length ?? 0} idee in lista`} />
      <SimpleActionList
        initialActions={actions ?? []}
        emptyIcon="💡"
        emptyText="Nessuna idea in lista"
      />
    </div>
  )
}
