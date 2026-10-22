import { Tag } from 'antd'
import { sourceLinks } from '../../data/dashboardData'

export function SourceStrip() {
  return (
    <div className="source-strip">
      <span>Mənbə xətti</span>
      {sourceLinks.slice(0, 3).map((source) => (
        <a key={source.name} href={source.url} target="_blank" rel="noreferrer">
          <Tag>{source.name}</Tag>
        </a>
      ))}
    </div>
  )
}
