interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  subVariant?: 'default' | 'up' | 'warn'
}

export function MetricCard({ label, value, sub, subVariant = 'default' }: MetricCardProps) {
  const subColor =
    subVariant === 'up'
      ? 'text-forest'
      : subVariant === 'warn'
        ? 'text-ember'
        : 'text-ink-muted'

  return (
    <div className="bg-card border border-edge rounded-[5px] px-[17px] pt-[15px] pb-[13px]">
      <div className="font-mono text-[8.5px] tracking-[0.1em] uppercase text-ink-dim mb-[9px]">
        {label}
      </div>
      <div className="font-serif text-[36px] font-bold tracking-[-0.03em] leading-none text-ink mb-[5px] tabular">
        {value}
      </div>
      {sub && <div className={`text-[11px] ${subColor}`}>{sub}</div>}
    </div>
  )
}