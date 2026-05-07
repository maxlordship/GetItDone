'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, ArrowRight } from 'lucide-react'
import type { InboxItem } from '@/types/database'
import ProcessModal from './ProcessModal'

export default function InboxList({ initialItems }: { initialItems: InboxItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [processing, setProcessing] = useState<InboxItem | null>(null)

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('inbox').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function handleProcessed(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    setProcessing(null)
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="text-4xl mb-3">✨</div>
        <p className="font-medium" style={{ color: 'var(--foreground)' }}>Inbox vuota</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          Usa il pulsante + per catturare nuove idee
        </p>
      </div>
    )
  }

  return (
    <>
      <ul className="divide-y px-0 md:px-4 md:py-2" style={{ borderColor: 'var(--border)' }}>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 px-4 py-3 md:rounded-xl md:px-4 group"
            style={{ background: 'var(--surface)' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                {item.title}
              </p>
              {item.notes && (
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--muted)' }}>
                  {item.notes}
                </p>
              )}
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {new Date(item.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setProcessing(item)}
                className="p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                style={{ color: 'var(--accent)' }}
                title="Processa"
              >
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                style={{ color: 'var(--danger)' }}
                title="Elimina"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {processing && (
        <ProcessModal
          item={processing}
          onDone={() => handleProcessed(processing.id)}
          onClose={() => setProcessing(null)}
        />
      )}
    </>
  )
}
