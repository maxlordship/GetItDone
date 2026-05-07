'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Action } from '@/types/database'

interface ActionWithRelations extends Action {
  areas?: { name: string; color: string } | null
  projects?: { title: string } | null
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Mon=0
}

const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

export default function CalendarView({ actions: initialActions }: { actions: ActionWithRelations[] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<string | null>(null)
  const [actions, setActions] = useState(initialActions)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const actionsByDay = actions.reduce<Record<string, ActionWithRelations[]>>((acc, a) => {
    if (!a.scheduled_at) return acc
    const d = new Date(a.scheduled_at)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate().toString()
      acc[key] = acc[key] ? [...acc[key], a] : [a]
    }
    return acc
  }, {})

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  async function markDone(id: string) {
    const supabase = createClient()
    await supabase.from('actions').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', id)
    setActions((prev) => prev.filter((a) => a.id !== id))
  }

  const selectedActions = selected ? (actionsByDay[selected] ?? []) : []

  return (
    <div className="px-4 md:px-6 py-4 space-y-4">
      {/* Header mese */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-lg" style={{ color: 'var(--muted)' }}>
          <ChevronLeft size={20} />
        </button>
        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
          {MONTHS_IT[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-2 rounded-lg" style={{ color: 'var(--muted)' }}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Griglia */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
        {/* Giorni settimana */}
        <div className="grid grid-cols-7 border-b" style={{ background: 'var(--surface-hover)', borderColor: 'var(--border)' }}>
          {DAYS_IT.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium" style={{ color: 'var(--muted)' }}>{d}</div>
          ))}
        </div>
        {/* Celle */}
        <div className="grid grid-cols-7" style={{ background: 'var(--surface)' }}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} className="h-12 md:h-16 border-b border-r" style={{ borderColor: 'var(--border)', background: 'var(--background)' }} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dayActions = actionsByDay[day.toString()] ?? []
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
            const isSelected = selected === day.toString()
            return (
              <button
                key={day}
                onClick={() => setSelected(isSelected ? null : day.toString())}
                className="h-12 md:h-16 border-b border-r flex flex-col items-center pt-1.5 gap-1 transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  background: isSelected ? 'var(--accent-soft)' : 'var(--surface)',
                }}
              >
                <span
                  className="text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full"
                  style={{
                    background: isToday ? 'var(--accent)' : 'transparent',
                    color: isToday ? '#fff' : isSelected ? 'var(--accent)' : 'var(--foreground)',
                  }}
                >
                  {day}
                </span>
                {dayActions.length > 0 && (
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {dayActions.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: a.areas?.color ?? 'var(--accent)' }}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Azioni del giorno selezionato */}
      {selected && (
        <div className="space-y-2">
          <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
            {selected} {MONTHS_IT[month]}
          </p>
          {selectedActions.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Nessuna azione pianificata</p>
          ) : (
            <ul className="space-y-2">
              {selectedActions.map((action) => (
                <li
                  key={action.id}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <button onClick={() => markDone(action.id)} style={{ color: 'var(--border)' }} className="mt-0.5 shrink-0">
                    <CheckCircle2 size={18} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{action.title}</p>
                    {action.scheduled_at && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                        {new Date(action.scheduled_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
