'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div
        className="rounded-2xl p-6 text-center space-y-3 border"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'var(--accent-soft)' }}
        >
          <Mail size={24} style={{ color: 'var(--accent)' }} />
        </div>
        <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Controlla la tua email</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Abbiamo inviato un link di accesso a <strong>{email}</strong>.
          <br />Clicca il link per entrare.
        </p>
        <button
          onClick={() => { setSent(false); setEmail('') }}
          className="text-sm underline"
          style={{ color: 'var(--muted)' }}
        >
          Usa un'altra email
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 space-y-4 border"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@esempio.com"
          required
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border transition-colors"
          style={{ background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        />
      </div>

      {error && (
        <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {loading ? 'Invio…' : 'Invia link di accesso'}
      </button>

      <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
        Niente password da ricordare. Ti inviamo un link via email.
      </p>
    </form>
  )
}
