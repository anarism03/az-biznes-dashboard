import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  title = 'Məlumat yoxdur',
  description = 'Seçilmiş filtr üçün göstərici tapılmadı. İli və ya sektoru dəyişin.',
  action,
}: EmptyStateProps) {
  return (
    <div className="empty" role="status">
      <div className="empty__icon">
        <Inbox size={26} strokeWidth={1.6} />
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
