import type { ReactNode } from 'react'
import { LiquidGlass } from '../glass/LiquidGlass'

interface PageIntroProps {
  kicker: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageIntro({ kicker, title, description, actions }: PageIntroProps) {
  return (
    <LiquidGlass as="section" className="page-intro">
      <div className="min-w-0">
        <div className="page-intro__kicker">{kicker}</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2 no-print">{actions}</div> : null}
    </LiquidGlass>
  )
}
