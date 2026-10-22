import { Skeleton } from 'antd'
import type { ReactNode } from 'react'
import { azNumber } from '../../utils/formatters'

interface ApiKpiCardProps {
  label: string
  loading?: boolean
  children: ReactNode
  active?: boolean
  onClick?: () => void
}

export function ApiKpiCard({ label, loading, children, active, onClick }: ApiKpiCardProps) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      className={`kpi-card tone-blue ${active ? 'is-active' : ''} ${onClick ? 'is-interactive' : ''}`.trim()}
      style={{ minHeight: 160 }}
      onClick={onClick}
    >
      <div className="kpi-row">
        <span>{label}</span>
      </div>
      <div className="mt-4 flex-1 flex flex-col">
        {loading ? (
          <Skeleton active paragraph={{ rows: 1, width: '60%' }} title={{ width: '40%' }} />
        ) : (
          <div className="flex flex-col h-full">{children}</div>
        )}
      </div>
    </Comp>
  )
}

interface TooltipPayloadItem {
  color?: string
  name?: string
  value?: number | null
}

interface DarkTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
  valueFormatter?: (value: number | null | undefined) => string
}

export function DarkTooltip({ active, payload, label, valueFormatter }: DarkTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{label}</div>
      {payload.map((p, i) => (
        <div key={`${p.name}-${i}`} className="chart-tooltip__row">
          <span className="chart-tooltip__swatch" style={{ background: p.color }} />
          <span className="chart-tooltip__name">{p.name}:</span>
          <span className="chart-tooltip__value">
            {p.value !== null && p.value !== undefined
              ? valueFormatter
                ? valueFormatter(p.value)
                : azNumber(p.value, 1)
              : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}
