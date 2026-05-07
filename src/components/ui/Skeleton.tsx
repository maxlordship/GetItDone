export function SkeletonLine({ width = 'full', height = 4 }: { width?: string | number; height?: number }) {
  const w = typeof width === 'number' ? `${width}%` : width === 'full' ? '100%' : width
  return (
    <div
      className="rounded animate-pulse"
      style={{ width: w, height: `${height * 4}px`, background: 'var(--border)' }}
    />
  )
}

const LINE_WIDTHS = [70, 55, 80, 60, 75, 50, 65]
const SUBLINE_WIDTHS = [35, 25, 40, 30, 45, 28, 38]

export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="w-5 h-5 rounded-full mt-0.5 animate-pulse shrink-0" style={{ background: 'var(--border)' }} />
          <div className="flex-1 space-y-2">
            <SkeletonLine width={LINE_WIDTHS[i % LINE_WIDTHS.length]} />
            <SkeletonLine width={SUBLINE_WIDTHS[i % SUBLINE_WIDTHS.length]} height={3} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonHeader({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <div
      className="flex items-start justify-between px-4 pt-6 pb-4 md:px-6 border-b"
      style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
    >
      <div className="space-y-2">
        <SkeletonLine width={120} height={5} />
        {subtitle && <SkeletonLine width={80} height={3} />}
      </div>
    </div>
  )
}
