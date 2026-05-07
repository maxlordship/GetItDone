interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div
      className="flex items-start justify-between px-4 pt-6 pb-4 md:px-6 sticky top-0 z-10 border-b"
      style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
