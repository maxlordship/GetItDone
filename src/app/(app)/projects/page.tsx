import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/layout/PageHeader'
import ProjectsList from './ProjectsList'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const [{ data: projects }, { data: areas }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, areas(name, color)')
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
    supabase.from('areas').select('*').order('name'),
  ])

  return (
    <div>
      <PageHeader title="Progetti" subtitle={`${projects?.length ?? 0} progetti attivi`} />
      <ProjectsList initialProjects={projects ?? []} areas={areas ?? []} />
    </div>
  )
}
