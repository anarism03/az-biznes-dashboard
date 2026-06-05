import { Card } from 'antd'

export function ChartCard({ title, subtitle, extra, children, className = '', ...props }) {
  return (
    <Card 
      className={`rounded-2xl p-5 border border-border bg-card shadow-sm h-full flex flex-col transition-all duration-200 hover:shadow-md ${className}`} 
      variant="borderless" 
      {...props}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-[14px] font-bold text-text-primary m-0 transition-colors duration-250">{title}</h4>
          {subtitle && <p className="text-[11px] text-text-muted mt-0.5 mb-0 transition-colors duration-250">{subtitle}</p>}
        </div>
        {extra}
      </div>
      <div>{children}</div>
    </Card>
  )
}
