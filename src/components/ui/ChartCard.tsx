import type { ReactNode } from 'react'
import { LiquidGlass } from '../glass/LiquidGlass'

interface PanelProps {
  title: string
  subtitle?: string
  extra?: ReactNode
  children: ReactNode
  className?: string
  id?: string
  hint?: ReactNode
  footer?: ReactNode
}

export function Panel({ title, subtitle, extra, children, className = '', hint, footer, id }: PanelProps) {
  return (
    <LiquidGlass as="section" id={id} className={`panel ${className}`} aria-label={title}>
      <header className="panel__head">
        <div className="min-w-0">
          <h3 className="panel__title">{title}</h3>
          {subtitle ? <p className="panel__subtitle">{subtitle}</p> : null}
          {hint ? <p className="panel__hint">{hint}</p> : null}
        </div>
        {extra ? <div className="shrink-0 flex items-center gap-2">{extra}</div> : null}
      </header>
      <div className="panel__body">{children}</div>
      {footer ? <footer className="panel__foot">{footer}</footer> : null}
    </LiquidGlass>
  )
}

/** Köhnə ad saxlanılır ki, bütün səhifələr eyni paneldən istifadə etsin. */
export const ChartCard = Panel
