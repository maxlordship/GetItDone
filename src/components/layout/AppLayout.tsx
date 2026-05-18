'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Inbox,
  Zap,
  FolderKanban,
  Calendar,
  Clock,
  Sparkles,
  Settings,
  Plus,
  ClipboardCheck,
  GitBranch,
} from 'lucide-react'
import { useState } from 'react'
import QuickCapture from '@/components/inbox/QuickCapture'
import { ToastProvider } from '@/components/ui/Toast'

const navItems = [
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/next-actions', label: 'Prossime', icon: Zap },
  { href: '/projects', label: 'Progetti', icon: FolderKanban },
  { href: '/calendar', label: 'Calendario', icon: Calendar },
  { href: '/waiting', label: 'In attesa', icon: Clock },
  { href: '/someday', label: 'Prima o poi', icon: Sparkles },
  { href: '/weekly-review', label: 'Review', icon: ClipboardCheck },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showCapture, setShowCapture] = useState(false)

  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>GetItDone</span>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--foreground)',
                }}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 1.75} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setShowCapture(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <Plus size={16} />
            Cattura rapida
          </button>
          <Link
            href="/gtd-flow"
            className="mt-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            <GitBranch size={16} />
            Flusso GTD
          </Link>
          <Link
            href="/settings"
            className="mt-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            <Settings size={16} />
            Impostazioni
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 border-t flex items-center justify-around px-1 py-2 z-40"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg min-w-0"
              style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium truncate">{label}</span>
            </Link>
          )
        })}

        {/* FAB cattura rapida */}
        <button
          onClick={() => setShowCapture(true)}
          className="flex flex-col items-center justify-center w-10 h-10 rounded-full shadow-lg"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          <Plus size={20} />
        </button>
      </nav>

      {/* Quick capture modal */}
      {showCapture && <QuickCapture onClose={() => setShowCapture(false)} />}
      <ToastProvider />
    </div>
  )
}
