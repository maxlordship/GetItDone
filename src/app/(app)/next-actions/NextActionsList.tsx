'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Circle } from 'lucide-react'
import type { Action, Area } from '@/types/database'

const CONTEXTS = ['tutti', '@casa', '@lavoro', '@telefono', '@computer', '@commissioni', '@lettura']

interface ActionWithRelations extends Action {
  areas?: { name: string; color: string } | null
  projects?: { title: string } | null
}

interface Props {
  initialActions: ActionWithRelations[]
  areas: Area[]
}

export default function NextActionsList({ initialActions, areas }: Props) {
  const [actions, setActions] = useState(initialActions)
  const [contextFilter, setContextFilter] = useState('tutti')
  const [areaFilter, setAreaFilter] = useState('all')

  async function toggleComplete(action: ActionWithRelations) {
    const supabase = createClient()
    await supabase
      .from('actions')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', action.id)
    setActions((prev) => prev.filter((a) => a.id !== action.id))
  }

  const filtered = actions.filter((a) => {
    if (contextFilter !== 'tutti' && a.context !== contextFilter) return false
    if (areaFilter !== 'all' && a.area_id !== areaFilter) return false
    return true
  })

  return (
    <div>
      {/* Filtri */}
      <div className="px-4 md:px-6 py-3 space-y-2 border-b" style={{ borderColor: 'var(--border)' }}>
        {/* Contesti */}
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
        {/* Aree */}
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

      {/* Lista azioni */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="font-medium" style={{ color: 'var(--foreground)' }}>Nessuna azione qui</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Processa qualcosa dall'inbox!</p>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {filtered.map((action) => (
            <li key={action.id} className="flex items-start gap-3 px-4 py-3 group" style={{ background: 'var(--surface)' }}>
              <button
                onClick={() => toggleComplete(action)}
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
      )}
    </div>
  )
}
