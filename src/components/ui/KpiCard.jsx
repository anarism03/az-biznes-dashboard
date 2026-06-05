import { Statistic, Tag } from 'antd'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { azNumber } from '../../utils/formatters.js'

export function KpiCard({ label, value, unit, change, changeText, source, tone = 'teal' }) {
  const positive = change >= 0

  return (
    <div className={`kpi-card tone-${tone} group`}>
      <div className="kpi-glow" />
      <div className="kpi-row">
        <span>{label}</span>
        <Tag
          color={positive ? 'success' : 'error'}
          className="kpi-tag !flex items-center gap-0.5"
        >
          {changeText ? null : positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {changeText || `${positive ? '+' : ''}${azNumber(change, 1)}%`}
        </Tag>
      </div>
      <Statistic
        value={value}
        precision={1}
        suffix={unit}
        styles={{
          content: {
            color: 'var(--text-primary)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
        }}
      />
      <small className="mt-auto pt-3 block text-[11px] text-text-muted transition-colors duration-250">
        {source}
      </small>
    </div>
  )
}
