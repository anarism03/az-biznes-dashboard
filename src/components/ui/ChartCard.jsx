import { Card } from 'antd'

export function ChartCard({ title, subtitle, extra, children, className = '', ...props }) {
  return (
    <Card className={`chart-card ${className}`} variant="borderless" {...props}>
      <div className="chart-card-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {extra}
      </div>
      <div className="chart-card-body">{children}</div>
    </Card>
  )
}
