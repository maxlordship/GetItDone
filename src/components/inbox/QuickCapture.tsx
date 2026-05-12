'use client'

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function QuickCapture({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('inbox').insert({ title: title.trim(), notes: notes.trim() || null, user_id: user.id })
      window.dispatchEvent(new CustomEvent('inbox-updated'))
    }
    setSaving(false)
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-xl p-5 space-y-3"
        style={{ background: 'var(--surface)' }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Cattura rapida</h2>
          <button onClick={onClose} style={{ color: 'var(--muted)' }}>
            <X size={18} />
          </button>
        </div>

        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cosa hai in testa?"
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border"
          style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Note (opzionale)"
          rows={2}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border resize-none"
          style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>⌘↵ per salvare</span>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-opacity"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {saving ? 'Salvo…' : 'Aggiungi all\'inbox'}
          </button>
        </div>
      </div>
    </div>
  )
}
