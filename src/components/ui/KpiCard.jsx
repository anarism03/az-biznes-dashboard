import { Statistic, Tag } from 'antd'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { azNumber } from '../../utils/formatters.js'

export function KpiCard({ label, value, unit, change, changeText, source, tone = 'teal' }) {
  const positive = change >= 0

  return (
    <div className={`kpi-card tone-${tone}`}>
      <div className="kpi-glow" />
      <div className="kpi-row">
        <span>{label}</span>
        <Tag color={positive ? 'success' : 'error'} className="kpi-tag">
          {changeText ? null : positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {changeText || `${positive ? '+' : ''}${azNumber(change, 1)}%`}
        </Tag>
      </div>
      <Statistic
        value={value}
        precision={1}
        suffix={unit}
        styles={{
          content: { color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.02em' },
        }}
      />
      <small>{source}</small>
    </div>
  )
}
