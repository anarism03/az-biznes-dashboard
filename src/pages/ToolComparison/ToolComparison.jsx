import { useState } from 'react'
import { motion } from 'motion/react'
import { Info } from 'lucide-react'
import { LiquidGlass } from '../../components/glass/LiquidGlass'
import { Panel } from '../../components/ui/ChartCard'
import { PageIntro } from '../../components/ui/PageIntro'
import { platformComparison, platformCriteria, selectionSteps } from '../../data/dashboardData'

const TONE = { tableau: 'var(--az-blue)', 'power-bi': 'var(--amber)', looker: 'var(--az-green)', d3: 'var(--az-red)', 'vega-lite': 'var(--slate)' }
const spring = { type: 'spring', bounce: 0.2, visualDuration: 0.38 }

export function ToolComparison() {
  const [focus, setFocus] = useState('tableau')
  const tool = platformComparison.find((t) => t.key === focus)

  return (
    <>
      <PageIntro
        kicker="Platforma seçimi"
        title="Bir alət bütün hallar üçün deyil"
        description="Tableau, Power BI və Looker kommersiya platformalarının, D3.js və Vega-Lite açıq mənbəli alətlərinin funksional müqayisəsi. Rəqəmsal bal və yekun reytinq hesablanmır: meyar çəkiləri konkret müəssisənin tələbləri ilə müəyyən edilir."
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
        {platformComparison.map((t) => {
          const isActive = t.key === focus
          return (
            <LiquidGlass
              key={t.key}
              as="button"
              type="button"
              onClick={() => setFocus(t.key)}
              className="kpi is-interactive press"
              style={{ minHeight: 132, outline: isActive ? `2px solid ${TONE[t.key]}` : 'none', outlineOffset: -2 }}
              aria-pressed={isActive}
            >
              <span className="kpi__label">
                <span className="kpi__swatch" style={{ background: TONE[t.key] }} />
                {t.tool}
              </span>
              <p className="text-[18px] font-bold leading-snug mt-3 mb-0">{t.focus}</p>
              <div className="kpi__foot">{t.criterion}</div>
            </LiquidGlass>
          )
        })}
      </div>

      <div className="grid-2-1">
        <Panel title="Funksional müqayisə matrisi" subtitle="Rəsmi texniki sənədlər əsasında keyfiyyət müqayisəsi (dissertasiya, Cədvəl 6)">
          <div className="overflow-x-auto">
            <table className="data-table" style={{ minWidth: 760 }}>
              <thead>
                <tr>
                  <th>Meyar</th>
                  {platformComparison.map((t) => (
                    <th key={t.key} style={{ color: t.key === focus ? TONE[t.key] : undefined }}>
                      {t.tool}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {platformCriteria.map((c) => (
                  <tr key={c.key}>
                    <td className="font-semibold">{c.label}</td>
                    {platformComparison.map((t) => (
                      <td
                        key={t.key}
                        style={{
                          background: t.key === focus ? `color-mix(in srgb, ${TONE[t.key]} 8%, transparent)` : undefined,
                          transition: 'background .3s',
                        }}
                      >
                        {t[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={tool.tool} subtitle="Seçilmiş platformanın profili">
          <motion.div key={tool.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="grid gap-3">
            {platformCriteria.map((c) => (
              <div key={c.key} className="rounded-2xl p-3" style={{ background: 'color-mix(in srgb, var(--text-primary) 4%, transparent)' }}>
                <div className="text-[12.5px] text-text-muted font-semibold">{c.label}</div>
                <div className="text-[14.5px] font-semibold mt-0.5">{tool[c.key]}</div>
              </div>
            ))}
          </motion.div>
        </Panel>
      </div>

      <Panel title="Çoxmeyarlı seçim metodologiyası" subtitle="“Ən populyar alət” tələsindən qoruyan ardıcıllıq (dissertasiya, 2.1)">
        <ol className="grid gap-3 m-0 p-0 list-none" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {selectionSteps.map((s, i) => (
            <li key={s} className="flex gap-3 items-start rounded-2xl p-3" style={{ background: 'color-mix(in srgb, var(--text-primary) 4%, transparent)' }}>
              <span className="grid place-items-center w-8 h-8 rounded-full shrink-0 text-[14px] font-bold num" style={{ background: 'color-mix(in srgb, var(--az-blue) 13%, transparent)', color: 'var(--az-blue)' }}>
                {i + 1}
              </span>
              <span className="text-[14.5px] leading-snug pt-1">{s}</span>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="note note--blue">
        <Info size={18} />
        <span>
          Microsoft 365 istifadə edən təşkilatda Power BI-ın inteqrasiyası, mürəkkəb vizual araşdırma üçün Tableau, mərkəzləşdirilmiş metrik
          idarəetməsi üçün Looker nəzərdən keçirilə bilər. Bunlar yerli şirkətlər arasında ölçülmüş seçim tezlikləri deyil.
        </span>
      </div>
    </>
  )
}
