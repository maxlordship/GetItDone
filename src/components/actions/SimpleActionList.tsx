'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Circle, Pencil } from 'lucide-react'
import type { Action, ActionType } from '@/types/database'
import { SkeletonList } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'
import ActionEditModal from '@/components/actions/ActionEditModal'

interface ActionWithArea extends Action {
  areas?: { name: string; color: string } | null
}

interface Props {
  type: ActionType
  emptyIcon: string
  emptyText: string
  showDelegatedTo?: boolean
}

export default function SimpleActionList({ type, emptyIcon, emptyText, showDelegatedTo }: Props) {
  const [actions, setActions] = useState<ActionWithArea[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ActionWithArea | null>(null)

  useEffect(() => {
    createClient()
      .from('actions')
      .select('*, areas(name, color)')
      .eq('type', type)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setActions(data ?? [])
        setLoading(false)
      })
  }, [type])

  async function markDone(id: string, title: string) {
    await createClient().from('actions').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', id)
    setActions((prev) => prev.filter((a) => a.id !== id))
    toast(`✓ "${title}" completata`)
  }

  function handleSaved(id: string, updates: Partial<Action>) {
    setActions((prev) => prev.map((a) => a.id === id ? { ...a, ...updates } : a))
  }

  if (loading) return <SkeletonList rows={4} />

  if (actions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-4xl mb-3">{emptyIcon}</div>
        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{emptyText}</p>
      </div>
    )
  }

  return (
    <>
      <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {actions.map((action) => (
          <li key={action.id} className="flex items-start gap-3 px-4 py-3 group" style={{ background: 'var(--surface)' }}>
            <button onClick={() => markDone(action.id, action.title)} className="mt-0.5 shrink-0" style={{ color: 'var(--border)' }}>
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
            <button
              onClick={() => setEditing(action)}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              style={{ color: 'var(--muted)' }}
              title="Modifica"
            >
              <Pencil size={14} />
            </button>
          </li>
        ))}
      </ul>

      {editing && (
        <ActionEditModal
          action={editing}
          onSave={(updates) => handleSaved(editing.id, updates)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
