import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import AreasManager from './AreasManager'
import LogoutButton from './LogoutButton'

export default async function SettingsPage() {
  const supabase = await createClient()
  const [{ data: areas }, { data: { user } }] = await Promise.all([
    supabase.from('areas').select('*').order('name'),
    supabase.auth.getUser(),
  ])

  return (
    <div>
      <PageHeader title="Impostazioni" />
      <div className="px-4 md:px-6 py-4 space-y-6 max-w-xl">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
            Aree di responsabilità
          </h2>
          <AreasManager initialAreas={areas ?? []} />
        </section>

        <section className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Account</h2>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>{user?.email}</p>
          <LogoutButton />
        </section>
      </div>
    </div>
  )
}
