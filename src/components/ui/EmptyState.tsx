import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  title = 'Məlumat yoxdur',
  description = 'Seçilmiş filtr üçün göstərici tapılmadı. İl və ya sektor filtrini dəyişin.',
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-panel" role="status">
      <div className="empty-panel__icon">
        <Inbox size={28} strokeWidth={1.5} />
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      {action ? <div className="empty-panel__action">{action}</div> : null}
    </div>
  )
}
