import { azNumber } from '../../utils/formatters'

interface TooltipPayloadItem {
  color?: string
  name?: string
  value?: number | null
  payload?: Record<string, unknown>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
  valueFormatter?: (value: number | null | undefined, name?: string) => string
  labelFormatter?: (label: string | number | undefined) => string
}

export function ChartTooltip({ active, payload, label, valueFormatter, labelFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{labelFormatter ? labelFormatter(label) : label}</div>
      {payload.map((p, i) => (
        <div key={`${p.name}-${i}`} className="chart-tooltip__row">
          <span className="chart-tooltip__swatch" style={{ background: p.color }} />
          <span className="chart-tooltip__name">{p.name}</span>
          <span className="chart-tooltip__value num">
            {p.value !== null && p.value !== undefined
              ? valueFormatter
                ? valueFormatter(p.value, p.name)
                : azNumber(p.value, 1)
              : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}

export const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: 'var(--chart-tick)', fontSize: 12.5, fontFamily: 'Onest Variable' },
} as const

export function Legend({ items }: { items: { label: string; color: string; kind?: 'box' | 'line' | 'dashed' }[] }) {
  return (
    <div className="legend">
      {items.map((item) => (
        <span key={item.label}>
          <i
            className={item.kind === 'line' ? 'is-line' : item.kind === 'dashed' ? 'is-dashed' : ''}
            style={item.kind === 'dashed' ? { color: item.color } : { background: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}
