import { Skeleton } from 'antd'
import { azNumber } from '../../utils/formatters.js'

export function ApiKpiCard({ label, loading, children }) {
  return (
    <div className="kpi-card tone-primary" style={{ minHeight: 160 }}>
      <div className="kpi-row">
        <span>{label}</span>
      </div>
      
      <div className="mt-4 flex-1 flex flex-col">
        {loading ? (
          <Skeleton active paragraph={{ rows: 1, width: '60%' }} title={{ width: '40%' }} />
        ) : (
          <div className="flex flex-col h-full">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-md)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{p.value !== null ? azNumber(p.value, 1) : '—'}</span>
        </div>
      ))}
    </div>
  )
}
