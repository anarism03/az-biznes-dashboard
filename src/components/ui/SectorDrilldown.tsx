import { Button, Drawer, Progress, Tag } from 'antd'
import { ArrowUpRight } from 'lucide-react'
import { sectorColor } from '../../utils/formatters'
import { fmt } from '../../pages/Overview/utils'
import type { MacroRow, SectorShare } from '../../types/dashboard'

interface SectorDrilldownProps {
  open: boolean
  sector: string | null
  year: string
  shares: SectorShare[]
  macro: MacroRow
  onClose: () => void
  onApplySectorFilter: (sector: string) => void
}

export function SectorDrilldown({
  open,
  sector,
  year,
  shares,
  macro,
  onClose,
  onApplySectorFilter,
}: SectorDrilldownProps) {
  const selected = shares.find((item) => item.sector === sector)
  const ranked = [...shares].sort((a, b) => b.share - a.share)
  const rank = selected ? ranked.findIndex((item) => item.sector === selected.sector) + 1 : null
  const peers = ranked.filter((item) => item.sector !== sector).slice(0, 4)

  return (
    <Drawer
      title={sector ? `${sector} — drill-down` : 'Sektor detalı'}
      open={open}
      onClose={onClose}
      width={420}
      destroyOnHidden
    >
      {!selected ? (
        <p className="text-sm text-text-secondary">Sektor seçilməyib.</p>
      ) : (
        <div className="drilldown-body">
          <div className="drilldown-hero">
            <span className="eyebrow">{year} · ÜDM payı</span>
            <strong style={{ color: sectorColor(selected.sector) }}>{fmt(selected.share)}%</strong>
            <p>
              Bu sektor seçilmiş ildə ÜDM strukturunda{' '}
              {rank ? `${rank}-ci` : '—'} yerdədir. Qərarvermə üçün digər sektorlarla pay müqayisəsi və
              makro kontekst eyni paneldə saxlanılır.
            </p>
          </div>

          <Progress
            percent={selected.share}
            strokeColor={sectorColor(selected.sector)}
            trailColor="var(--border)"
            format={(p) => `${fmt(p ?? 0)}%`}
          />

          <div className="drilldown-meta">
            <div>
              <small>Makro kontekst</small>
              <strong>{fmt(macro.gdp / 1000)} mlrd AZN ÜDM</strong>
            </div>
            <div>
              <small>Qeyri-neft artımı</small>
              <strong>{fmt(macro.nonOilGrowth)}%</strong>
            </div>
            <div>
              <small>Dövr statusu</small>
              <Tag color={macro.status === 'Tam il' ? 'green' : 'gold'}>{macro.status}</Tag>
            </div>
          </div>

          <h4 className="drilldown-subtitle">Müqayisəli sektorlar</h4>
          <ul className="drilldown-peers">
            {peers.map((peer) => (
              <li key={peer.sector}>
                <button type="button" onClick={() => onApplySectorFilter(peer.sector)}>
                  <span style={{ background: sectorColor(peer.sector) }} />
                  <strong>{peer.sector}</strong>
                  <em>{fmt(peer.share)}%</em>
                </button>
              </li>
            ))}
          </ul>

          <div className="drilldown-actions">
            <Button
              type="primary"
              icon={<ArrowUpRight size={16} />}
              onClick={() => {
                onApplySectorFilter(selected.sector)
                onClose()
              }}
            >
              Filtrə tətbiq et
            </Button>
            <Button onClick={onClose}>Bağla</Button>
          </div>
        </div>
      )}
    </Drawer>
  )
}
