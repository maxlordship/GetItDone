import InboxList from './InboxList'
import PageHeader from '@/components/layout/PageHeader'

export default function InboxPage() {
  return (
    <div>
      <PageHeader title="Inbox" subtitle=" " />
      <InboxList />
    </div>
  )
}
