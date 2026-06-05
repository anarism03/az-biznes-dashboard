import { Card } from 'antd'

export function ChartCard({ title, subtitle, extra, children, className = '', ...props }) {
  return (
    <Card
      className={`rounded-2xl border border-border bg-card shadow-sm h-full flex flex-col transition-all duration-200 hover:shadow-md ${className}`}
      styles={{ body: { padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' } }}
      variant="borderless"
      {...props}
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="min-w-0">
          <h4 className="text-[14px] font-bold text-text-primary m-0 transition-colors duration-250 leading-snug">
            {title}
          </h4>
          {subtitle && (
            <p className="text-[11px] text-text-muted mt-1 mb-0 transition-colors duration-250 leading-normal">
              {subtitle}
            </p>
          )}
        </div>
        {extra && <div className="shrink-0">{extra}</div>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </Card>
  )
}
