'use client'

import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'

function Box({ children, color = 'surface', className = '' }: { children: React.ReactNode; color?: 'surface' | 'accent' | 'success' | 'danger' | 'muted'; className?: string }) {
  const styles: Record<string, React.CSSProperties> = {
    surface: { background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--foreground)' },
    accent: { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' },
    success: { background: 'var(--success)', borderColor: 'var(--success)', color: '#fff' },
    danger: { background: 'var(--danger)', borderColor: 'var(--danger)', color: '#fff' },
    muted: { background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--muted)' },
  }
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium text-center leading-snug ${className}`}
      style={styles[color]}
    >
      {children}
    </div>
  )
}

function Diamond({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center justify-center my-1">
      <div
        className="w-40 h-40 rotate-45 border-2 flex items-center justify-center"
        style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}
      >
        <div className="-rotate-45 text-center px-2">
          <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--accent)' }}>{children}</p>
        </div>
      </div>
    </div>
  )
}

function Arrow({ label, horizontal }: { label?: string; horizontal?: boolean }) {
  if (horizontal) {
    return (
      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
        {label && <span>{label}</span>}
        <ArrowRight size={14} />
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-0.5 my-0.5">
      <ArrowDown size={14} style={{ color: 'var(--muted)' }} />
      {label && <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>}
    </div>
  )
}

function Row({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex items-center gap-3 ${className}`}>{children}</div>
}

export default function GtdFlowPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Flusso GTD</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Come decidere cosa fare con ogni cosa che catturi</p>
      </div>

      <div className="flex flex-col items-center gap-0 text-sm">

        {/* Capture */}
        <Box color="accent" className="w-48">📥 Cattura</Box>
        <Arrow label="Chiediti:" />

        {/* Is it actionable? */}
        <Diamond>È qualcosa<br />che richiede<br />un&apos;azione?</Diamond>

        {/* NO branch */}
        <div className="w-full flex justify-between items-start gap-2 -mt-4">
          {/* NO */}
          <div className="flex flex-col items-center gap-1 w-36">
            <span className="text-xs font-semibold" style={{ color: 'var(--danger)' }}>NO</span>
            <Arrow />
            <div className="flex flex-col gap-2 w-full">
              <Box color="muted">🗑 Elimina</Box>
              <Box color="muted">📦 Archivio<br /><span className="text-xs font-normal">(riferimento futuro)</span></Box>
              <Box color="muted">💡 Prima o poi<br /><span className="text-xs font-normal">(forse un giorno)</span></Box>
            </div>
          </div>

          {/* YES */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>SÌ</span>
            <Arrow label="Qual è la prossima azione?" />

            <Diamond>Ci vuole<br />meno di<br />2 minuti?</Diamond>

            {/* 2min YES */}
            <div className="w-full flex flex-col items-center gap-1 mt-1">
              <Row>
                <Arrow label="SÌ" horizontal />
                <Box color="success" className="shrink-0">✅ Fallo<br />subito!</Box>
              </Row>
            </div>

            <Arrow label="NO" />

            <Diamond>Devi<br />farlo tu<br />stesso?</Diamond>

            <div className="w-full flex justify-between gap-2 mt-1">
              {/* Delegate */}
              <div className="flex flex-col items-center gap-1 w-32">
                <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>NO</span>
                <Arrow />
                <Box color="muted" className="w-full">👤 Delega<br /><span className="text-xs font-normal">→ In attesa</span></Box>
              </div>

              {/* Defer */}
              <div className="flex flex-col items-center gap-1 flex-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>SÌ</span>
                <Arrow />

                <Diamond>Ha una<br />data<br />precisa?</Diamond>

                <div className="w-full flex justify-between gap-2 mt-1">
                  <div className="flex flex-col items-center gap-1 w-28">
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>SÌ</span>
                    <Arrow />
                    <Box color="muted" className="w-full">📅 Agenda<br /><span className="text-xs font-normal">(Calendario)</span></Box>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>NO</span>
                    <Arrow />
                    <Box color="muted" className="w-full">⚡️ Prossime<br />azioni</Box>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-step? */}
        <div className="mt-6 w-full border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3 text-center" style={{ color: 'var(--muted)' }}>Se richiede più passi</p>
          <div className="flex flex-col items-center gap-1">
            <Box color="accent" className="w-full">📁 Crea un Progetto</Box>
            <Arrow />
            <Box color="surface" className="w-full">Definisci la prima azione concreta e mettila nelle Prossime azioni</Box>
          </div>
        </div>

        {/* Weekly review reminder */}
        <div className="mt-6 w-full rounded-2xl p-4 border" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>🔄 Weekly Review</p>
          <p className="text-xs" style={{ color: 'var(--foreground)' }}>
            Ogni settimana, rivedi tutti i tuoi elenchi: inbox a zero, prossime azioni aggiornate, ogni progetto con almeno una prossima azione.
          </p>
          <Link href="/weekly-review" className="inline-block mt-2 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            Vai alla Review →
          </Link>
        </div>
      </div>
    </div>
  )
}
