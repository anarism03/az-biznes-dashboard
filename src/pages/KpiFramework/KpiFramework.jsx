import { useOutletContext } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Coins, Database, GraduationCap, Layers, LayoutDashboard, Settings2, Users, Workflow } from 'lucide-react'
import { LiquidGlass } from '../../components/glass/LiquidGlass'
import { Panel } from '../../components/ui/ChartCard'
import { PageIntro } from '../../components/ui/PageIntro'
import { ChartTooltip, axisProps } from '../../components/ui/ChartTooltip'
import { kpiRows } from '../../data/dashboardData'
import { azNumber } from '../../utils/formatters'

const ICONS = { financial: Coins, customer: Users, process: Settings2, learning: GraduationCap }
const TONES = { financial: 'var(--az-blue)', customer: 'var(--az-green)', process: 'var(--az-red)', learning: 'var(--amber)' }

const layers = [
  { icon: Database, title: 'Mənbə sistemləri', text: 'ERP, CRM, POS, DSK və Dünya Bankı açıq məlumatları' },
  { icon: Workflow, title: 'İnteqrasiya və anbar', text: 'Təmizləmə, normallaşdırma, tarixçə və keyfiyyət testləri' },
  { icon: Layers, title: 'Semantik / metrik qat', text: 'KPI lüğəti, vahid düstur, ölçü vahidi və məsul şəxs' },
  { icon: LayoutDashboard, title: 'Vizual təqdimat', text: 'KPI kartları, filtr, detal baxışı və qərar siqnalı' },
]

const steps = [
  'Biznes sualı və qərar sahibi müəyyən edilir',
  'Metrik düsturu, mənbə sistemi və yenilənmə dövrü yazılır',
  'Vizual forma göstəricinin məqsədinə görə seçilir',
  'Nəticə qərar sahibi və hesabat çıxışı ilə bağlanır',
]

export function KpiFramework() {
  const { selectedMacro: m } = useOutletContext()
  const rows = [
    { name: 'ÜDM', value: m.gdp / 1000, c: 'var(--az-blue)' },
    { name: 'Qeyri-neft/qaz ÜDM', value: m.nonOilGdp / 1000, c: 'var(--az-green)' },
    { name: 'Sənaye', value: m.industry / 1000, c: 'var(--az-red)' },
    { name: 'Qeyri-neft sənayesi', value: m.nonOilIndustry / 1000, c: 'color-mix(in srgb, var(--az-red) 55%, transparent)' },
    { name: 'İnvestisiya', value: m.investment / 1000, c: 'var(--amber)' },
    { name: 'Kənd təsərrüfatı', value: m.agriculture / 1000, c: 'color-mix(in srgb, var(--az-green) 55%, transparent)' },
  ]

  return (
    <>
      <PageIntro
        kicker="KPI çərçivəsi"
        title="Hər göstərici bir qərara xidmət etməlidir"
        description="Balanslaşdırılmış Hesab Kartının dörd perspektivi, KPI lüğəti və göstəricinin mənbədən panelə qədər keçdiyi yol. KPI sayı universal həddə görə deyil, qərar tapşırığına görə seçilir."
      />

      <div className="grid-kpi">
        {kpiRows.map((row) => {
          const Icon = ICONS[row.key]
          return (
            <LiquidGlass key={row.key} className="kpi">
              <span className="kpi__label">
                <span className="grid place-items-center w-9 h-9 rounded-xl" style={{ background: `color-mix(in srgb, ${TONES[row.key]} 14%, transparent)`, color: TONES[row.key] }}>
                  <Icon size={19} />
                </span>
                {row.perspective}
              </span>
              <p className="text-[15px] font-semibold leading-snug mt-3 mb-1">{row.kpi}</p>
              <div className="kpi__foot">{row.decision}</div>
            </LiquidGlass>
          )
        })}
      </div>

      <Panel title="KPI-nin dashboard arxitekturasına inteqrasiyası" subtitle="Dörd qatlı məntiqi model (dissertasiya, Şəkil 4)">
        <div className="grid-kpi">
          {layers.map((l, i) => (
            <div key={l.title} className="relative rounded-2xl p-4" style={{ background: 'color-mix(in srgb, var(--text-primary) 4%, transparent)' }}>
              <div className="flex items-center gap-2 text-az-blue mb-2">
                <l.icon size={20} />
                <span className="text-[13px] font-semibold text-text-muted">{i + 1}-ci qat</span>
              </div>
              <div className="text-[15.5px] font-bold">{l.title}</div>
              <p className="text-[13.5px] text-text-secondary leading-relaxed mt-1 mb-0">{l.text}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid-2-1">
        <Panel title="KPI lüğəti və vizual kodlaşdırma" subtitle="Panel qurulmazdan əvvəl metrik adı, mənbə və vizual forma razılaşdırılır">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Perspektiv</th>
                  <th>KPI nümunələri</th>
                  <th>Vizual forma</th>
                  <th>Qərar istifadəsi</th>
                </tr>
              </thead>
              <tbody>
                {kpiRows.map((row) => (
                  <tr key={row.key}>
                    <td>
                      <span className="chip" style={{ color: TONES[row.key], background: `color-mix(in srgb, ${TONES[row.key]} 12%, transparent)` }}>
                        {row.perspective}
                      </span>
                    </td>
                    <td>{row.kpi}</td>
                    <td>{row.chart}</td>
                    <td>{row.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="KPI qurma ardıcıllığı" subtitle="Metrikdən qərara qədər">
          <ol className="grid gap-3 m-0 p-0 list-none">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3 items-start">
                <span className="grid place-items-center w-8 h-8 rounded-full shrink-0 text-[14px] font-bold num" style={{ background: 'color-mix(in srgb, var(--az-blue) 13%, transparent)', color: 'var(--az-blue)' }}>
                  {i + 1}
                </span>
                <span className="text-[14.5px] leading-relaxed pt-1">{s}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel title={`${m.period}: KPI bazası`} subtitle="Dövlət Statistika Komitəsi · mlrd AZN" footer={m.source}>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 12, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} interval={0} />
              <YAxis {...axisProps} width={44} />
              <Tooltip cursor={{ fill: 'var(--bg-hover)' }} content={<ChartTooltip valueFormatter={(v) => `${azNumber(v, 1)} mlrd AZN`} />} />
              <Bar dataKey="value" name="Göstərici" radius={[10, 10, 3, 3]} maxBarSize={72}>
                {rows.map((r) => (
                  <Cell key={r.name} fill={r.c} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </>
  )
}
