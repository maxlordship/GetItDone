import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import InboxList from './InboxList'

export default async function InboxPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('inbox')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle={items?.length ? `${items.length} elementi da processare` : 'Inbox vuota — ottimo lavoro!'}
      />
      <InboxList initialItems={items ?? []} />
    </div>
  )
}
