'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Circle } from 'lucide-react'
import type { Action } from '@/types/database'

interface ActionWithArea extends Action {
  areas?: { name: string; color: string } | null
}

interface Props {
  initialActions: ActionWithArea[]
  emptyIcon: string
  emptyText: string
  showDelegatedTo?: boolean
}

export default function SimpleActionList({ initialActions, emptyIcon, emptyText, showDelegatedTo }: Props) {
  const [actions, setActions] = useState(initialActions)

  async function markDone(id: string) {
    const supabase = createClient()
    await supabase.from('actions').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', id)
    setActions((prev) => prev.filter((a) => a.id !== id))
  }

  if (actions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-4xl mb-3">{emptyIcon}</div>
        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{emptyText}</p>
      </div>
    )
  }

  return (
    <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
      {actions.map((action) => (
        <li key={action.id} className="flex items-start gap-3 px-4 py-3" style={{ background: 'var(--surface)' }}>
          <button onClick={() => markDone(action.id)} className="mt-0.5 shrink-0" style={{ color: 'var(--border)' }}>
            <Circle size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{action.title}</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {showDelegatedTo && action.delegated_to && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-hover)', color: 'var(--muted)' }}>
                  → {action.delegated_to}
                </span>
              )}
              {action.areas && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: action.areas.color + '20', color: action.areas.color }}>
                  {action.areas.name}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
