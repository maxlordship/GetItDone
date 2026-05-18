'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Circle } from 'lucide-react'
import type { Action, Area } from '@/types/database'
import { SkeletonList } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'

const CONTEXTS = ['tutti', '@casa', '@lavoro', '@telefono', '@computer', '@commissioni', '@lettura']

interface ActionWithRelations extends Action {
  areas?: { name: string; color: string } | null
  projects?: { title: string } | null
}

export default function NextActionsList() {
  const [actions, setActions] = useState<ActionWithRelations[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [contextFilter, setContextFilter] = useState('tutti')
  const [areaFilter, setAreaFilter] = useState('all')

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase
        .from('actions')
        .select('*, areas(name, color), projects(title)')
        .eq('type', 'next_action')
        .eq('completed', false)
        .order('created_at', { ascending: true }),
      supabase.from('areas').select('*').order('name'),
    ]).then(([{ data: actionsData }, { data: areasData }]) => {
      setActions(actionsData ?? [])
      setAreas(areasData ?? [])
      setLoading(false)
    })
  }, [])

  async function toggleComplete(id: string, title: string) {
    await createClient()
      .from('actions')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', id)
    setActions((prev) => prev.filter((a) => a.id !== id))
    toast(`✓ "${title}" completata`)
  }

  const filtered = actions.filter((a) => {
    if (contextFilter !== 'tutti' && a.context !== contextFilter) return false
    if (areaFilter !== 'all' && a.area_id !== areaFilter) return false
    return true
  })

  if (loading) {
    return (
      <div>
        <div className="px-4 py-3 border-b flex gap-2" style={{ borderColor: 'var(--border)' }}>
          {[80, 70, 90, 75, 85].map((w, i) => (
            <div key={i} className="h-7 rounded-full animate-pulse" style={{ width: w, background: 'var(--border)' }} />
          ))}
        </div>
        <SkeletonList rows={6} />
      </div>
    )
  }

  return (
    <div>
      {/* Filtri */}
      <div className="px-4 md:px-6 py-3 space-y-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CONTEXTS.map((c) => (
            <button
              key={c}
              onClick={() => setContextFilter(c)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={{
                background: contextFilter === c ? 'var(--accent)' : 'var(--surface)',
                borderColor: contextFilter === c ? 'var(--accent)' : 'var(--border)',
                color: contextFilter === c ? '#fff' : 'var(--muted)',
              }}
            >
              {c}
            </button>
          ))}
        </div>
        {areas.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setAreaFilter('all')}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={{
                background: areaFilter === 'all' ? 'var(--foreground)' : 'var(--surface)',
                borderColor: areaFilter === 'all' ? 'var(--foreground)' : 'var(--border)',
                color: areaFilter === 'all' ? '#fff' : 'var(--muted)',
              }}
            >
              Tutte le aree
            </button>
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => setAreaFilter(area.id)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5"
                style={{
                  background: areaFilter === area.id ? area.color + '20' : 'var(--surface)',
                  borderColor: areaFilter === area.id ? area.color : 'var(--border)',
                  color: areaFilter === area.id ? area.color : 'var(--muted)',
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: area.color }} />
                {area.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="font-medium" style={{ color: 'var(--foreground)' }}>Nessuna azione qui</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Processa qualcosa dall&apos;inbox!</p>
        </div>
      ) : (
        <>
          <p className="px-4 pt-3 pb-1 text-sm" style={{ color: 'var(--muted)' }}>
            {filtered.length} {filtered.length === 1 ? 'azione' : 'azioni'}
          </p>
          <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {filtered.map((action) => (
              <li key={action.id} className="flex items-start gap-3 px-4 py-3" style={{ background: 'var(--surface)' }}>
                <button
                  onClick={() => toggleComplete(action.id, action.title)}
                  className="mt-0.5 shrink-0 transition-colors"
                  style={{ color: 'var(--border)' }}
                >
                  <Circle size={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{action.title}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {action.context && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        {action.context}
                      </span>
                    )}
                    {action.areas && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: action.areas.color + '20', color: action.areas.color }}>
                        {action.areas.name}
                      </span>
                    )}
                    {action.projects && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-hover)', color: 'var(--muted)' }}>
                        {action.projects.title}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
