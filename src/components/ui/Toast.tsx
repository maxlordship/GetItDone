'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ToastMessage {
  id: number
  message: string
  action?: { label: string; onClick: () => void }
}

let addToast: (message: string, action?: ToastMessage['action']) => void = () => {}

export function toast(message: string, action?: ToastMessage['action']) {
  addToast(message, action)
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    addToast = (message, action) => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, action }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 4000)
    }
  }, [])

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          <CheckCircle2 size={15} />
          <span>{t.message}</span>
          {t.action && (
            <button
              onClick={() => { t.action!.onClick(); dismiss(t.id) }}
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'var(--background)' }}
            >
              {t.action.label}
            </button>
          )}
          <button onClick={() => dismiss(t.id)}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
