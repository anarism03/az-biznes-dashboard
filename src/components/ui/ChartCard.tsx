import { Card } from 'antd'
import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  extra?: ReactNode
  children: ReactNode
  className?: string
  id?: string
  hint?: string
}

export function ChartCard({
  title,
  subtitle,
  extra,
  children,
  className = '',
  hint,
  ...props
}: ChartCardProps) {
  return (
    <Card
      className={`chart-card border border-border bg-card shadow-sm h-full flex flex-col transition-colors duration-200 ${className}`}
      styles={{ body: { padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' } }}
      variant="borderless"
      {...props}
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="min-w-0">
          <h4 className="text-[14px] font-bold text-text-primary m-0 leading-snug font-display">{title}</h4>
          {subtitle ? (
            <p className="text-[11px] text-text-muted mt-1 mb-0 leading-normal">{subtitle}</p>
          ) : null}
          {hint ? <p className="chart-hint">{hint}</p> : null}
        </div>
        {extra ? <div className="shrink-0">{extra}</div> : null}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </Card>
  )
}
