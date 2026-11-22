import { Drawer } from 'antd'
import { ArrowUpRight, Filter } from 'lucide-react'
import { sectorColor, azNumber } from '../../utils/formatters'
import type { MacroRow, SectorShare } from '../../types/dashboard'

interface SectorDrilldownProps {
  open: boolean
  sector: string | null
  year: string
  shares: SectorShare[]
  macro: MacroRow
  onClose: () => void
  onApplySectorFilter: (sector: string) => void
  onSelectPeer: (sector: string) => void
}

export function SectorDrilldown({
  open,
  sector,
  year,
  shares,
  macro,
  onClose,
  onApplySectorFilter,
  onSelectPeer,
}: SectorDrilldownProps) {
  const selected = shares.find((item) => item.sector === sector)
  const ranked = [...shares].sort((a, b) => b.share - a.share)
  const rank = selected ? ranked.findIndex((item) => item.sector === selected.sector) + 1 : null
  const peers = ranked.filter((item) => item.sector !== sector).slice(0, 5)
  const color = selected ? sectorColor(selected.sector) : 'var(--az-blue)'
  const estimate = selected ? (macro.gdp * selected.share) / 100 / 1000 : null

  return (
    <Drawer title={sector ?? 'Sektor detalı'} open={open} onClose={onClose} width={440} destroyOnHidden placement="right">
      {!selected ? (
        <p className="text-text-secondary">Bu il üçün seçilmiş sektorun payı yoxdur.</p>
      ) : (
        <div className="drill">
          <div>
            <div className="text-[14px] text-text-secondary font-semibold">{year} · ÜDM-dəki payı</div>
            <div className="drill__value num" style={{ color }}>
              {azNumber(selected.share, 1)}%
            </div>
            <p className="text-[14.5px] leading-relaxed text-text-secondary mt-3 mb-0">
              Sektor seçilmiş ildə ÜDM strukturunda {rank}-ci yerdədir. Pay ilə ÜDM-in həcmi əsasında hesablanan təxmini
              dəyər təxminən <strong className="text-text-primary">{azNumber(estimate, 1)} mlrd AZN</strong>-dir.
            </p>
          </div>

          <div className="sector-row__track" style={{ height: 10 }}>
            <span style={{ width: `${selected.share}%`, background: color }} />
          </div>

          <div className="drill__meta">
            <div>
              <small>ÜDM ({macro.period})</small>
              <strong className="num">{azNumber(macro.gdp / 1000, 1)} mlrd AZN</strong>
            </div>
            <div>
              <small>Qeyri-neft/qaz artımı</small>
              <strong className="num">{azNumber(macro.nonOilGrowth, 1)}%</strong>
            </div>
            <div>
              <small>Sıra</small>
              <strong>
                {rank} / {shares.length}
              </strong>
            </div>
            <div>
              <small>Dövr</small>
              <strong>{macro.status}</strong>
            </div>
          </div>

          <div>
            <div className="text-[14px] font-bold mb-2">Müqayisə üçün digər sektorlar</div>
            <div className="sector-list">
              {peers.map((peer) => (
                <button key={peer.sector} type="button" className="sector-row press" onClick={() => onSelectPeer(peer.sector)}>
                  <span className="sector-row__name">
                    <span className="dot" style={{ background: sectorColor(peer.sector) }} />
                    <span>{peer.sector}</span>
                  </span>
                  <span className="sector-row__value num">{azNumber(peer.share, 1)}%</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button type="button" className="pill-btn pill-btn--primary press" onClick={() => onApplySectorFilter(selected.sector)}>
              <Filter size={16} /> Panelə filtr kimi tətbiq et
            </button>
            <button type="button" className="pill-btn press" onClick={onClose}>
              Bağla <ArrowUpRight size={16} />
            </button>
          </div>
          <p className="text-[12.5px] text-text-muted m-0">Mənbə: {macro.source}. Təxmini dəyər pay × ÜDM kimi hesablanıb.</p>
        </div>
      )}
    </Drawer>
  )
}
