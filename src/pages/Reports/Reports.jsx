import { BookMarked, ExternalLink, Printer } from 'lucide-react'
import { LiquidGlass } from '../../components/glass/LiquidGlass'
import { Panel } from '../../components/ui/ChartCard'
import { PageIntro } from '../../components/ui/PageIntro'
import { chapterMap, recommendations, sourceLinks } from '../../data/dashboardData'

export function Reports() {
  return (
    <>
      <PageIntro
        kicker="Hesabat"
        title="Dissertasiyanın quruluşu, təkliflər və mənbələr"
        description="Paneldəki hər rəqəmin mənbəyi və dövrü aşağıda göstərilir. Səhifəni PDF kimi saxlamaq üçün çap düyməsindən istifadə edin."
        actions={
          <button type="button" className="pill-btn pill-btn--primary press" onClick={() => window.print()}>
            <Printer size={17} /> Çap / PDF
          </button>
        }
      />

      <div className="grid-3">
        {chapterMap.map((ch) => (
          <LiquidGlass key={ch.title} className="panel">
            <span className="chip chip--blue self-start">{ch.title}</span>
            <h3 className="panel__title mt-3">{ch.subtitle}</h3>
            <ul className="prose-list mt-3">
              {ch.points.map((p) => (
                <li key={p}>
                  <BookMarked size={15} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </LiquidGlass>
        ))}
      </div>

      <Panel title="Nəticə və təkliflər" subtitle="Empirik nəticələrdən irəli gələn tətbiq istiqamətləri">
        <ol className="grid gap-3 m-0 p-0 list-none">
          {recommendations.map((r, i) => (
            <li key={r} className="flex gap-3 items-start">
              <span className="grid place-items-center w-8 h-8 rounded-full shrink-0 text-[14px] font-bold num" style={{ background: 'color-mix(in srgb, var(--az-green) 14%, transparent)', color: 'var(--az-green)' }}>
                {i + 1}
              </span>
              <span className="text-[15px] leading-relaxed pt-1">{r}</span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Mənbələr" subtitle="Paneldəki rəsmi və metodoloji məlumatların mənşəyi">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mənbə</th>
                <th>İstifadə olunan məlumat</th>
              </tr>
            </thead>
            <tbody>
              {sourceLinks.map((s) => (
                <tr key={s.name}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-az-blue no-underline hover:underline">
                      {s.name} <ExternalLink size={13} />
                    </a>
                  </td>
                  <td className="text-text-secondary">{s.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}
