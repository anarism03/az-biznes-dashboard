import { Button, Tag } from 'antd'
import { RotateCcw, X } from 'lucide-react'

interface FilterChipsProps {
  year: string
  sector: string
  drillSector: string | null
  onClearSector: () => void
  onClearDrill: () => void
  onReset: () => void
}

export function FilterChips({
  year,
  sector,
  drillSector,
  onClearSector,
  onClearDrill,
  onReset,
}: FilterChipsProps) {
  const hasCustom = sector !== 'Hamısı' || Boolean(drillSector)

  return (
    <div className="filter-chips">
      <span className="filter-chips__label">Aktiv filtrlər</span>
      <Tag color="cyan">İl: {year}</Tag>
      {sector !== 'Hamısı' ? (
        <Tag
          color="blue"
          closable
          closeIcon={<X size={12} />}
          onClose={(e) => {
            e.preventDefault()
            onClearSector()
          }}
        >
          Sektor: {sector}
        </Tag>
      ) : (
        <Tag>Sektor: Hamısı</Tag>
      )}
      {drillSector ? (
        <Tag
          color="geekblue"
          closable
          closeIcon={<X size={12} />}
          onClose={(e) => {
            e.preventDefault()
            onClearDrill()
          }}
        >
          Drill-down: {drillSector}
        </Tag>
      ) : null}
      {hasCustom ? (
        <Button type="link" size="small" icon={<RotateCcw size={14} />} onClick={onReset}>
          Sıfırla
        </Button>
      ) : null}
    </div>
  )
}
