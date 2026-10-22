import { Skeleton, Statistic, Tag } from 'antd'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { azNumber } from '../../utils/formatters'
import type { KpiCardProps } from '../../types/dashboard'

export function KpiCard({
  label,
  value,
  unit,
  change = 0,
  changeText,
  source,
  tone = 'teal',
  active = false,
  onClick,
  loading = false,
}: KpiCardProps) {
  const positive = change >= 0

  return (
    <button
      type="button"
      className={`kpi-card tone-${tone} group ${active ? 'is-active' : ''} ${onClick ? 'is-interactive' : ''}`}
      onClick={onClick}
      disabled={!onClick}
    >
      <div className="kpi-glow" />
      <div className="kpi-row">
        <span>{label}</span>
        <Tag color={positive ? 'success' : 'error'} className="kpi-tag !flex items-center gap-0.5">
          {changeText ? null : positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {changeText || `${positive ? '+' : ''}${azNumber(change, 1)}%`}
        </Tag>
      </div>
      {loading ? (
        <Skeleton active title={{ width: '70%' }} paragraph={false} />
      ) : (
        <Statistic
          value={value}
          precision={1}
          suffix={unit}
          styles={{
            content: {
              color: 'var(--text-primary)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              fontFamily: "'Syne', 'DM Sans', sans-serif",
            },
          }}
        />
      )}
      {source ? (
        <small className="mt-auto pt-3 block text-[11px] text-text-muted transition-colors duration-250">
          {source}
        </small>
      ) : null}
    </button>
  )
}
