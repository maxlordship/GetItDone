'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ToastMessage {
  id: number
  message: string
}

let addToast: (message: string) => void = () => {}

export function toast(message: string) {
  addToast(message)
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    addToast = (message: string) => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          <CheckCircle2 size={15} />
          {t.message}
          <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
