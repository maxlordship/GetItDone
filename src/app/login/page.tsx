import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4"
      style={{ background: 'var(--background)' }}
    >
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            GetItDone
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            Il tuo sistema GTD personale
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
