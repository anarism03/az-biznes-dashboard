import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, ArrowRight, Lightbulb, MousePointerClick, RefreshCw } from 'lucide-react'
import { LiquidGlass } from '../../components/glass/LiquidGlass'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { Panel } from '../../components/ui/ChartCard'
import { ChartTooltip, Legend, axisProps } from '../../components/ui/ChartTooltip'
import { EmptyState } from '../../components/ui/EmptyState'
import { KpiCard } from '../../components/ui/KpiCard'
import { SectorDrilldown } from '../../components/ui/SectorDrilldown'
import { annualOfficialMacro, years } from '../../data/dashboardData'
import { WB_SNAPSHOT_DATE } from '../../data/worldBankSnapshot'
import { azNumber, sectorColor } from '../../utils/formatters'
import type { DashboardFilters, WbValue } from '../../types/dashboard'
import { pctDelta } from './utils'

const spring = { type: 'spring', bounce: 0.2, visualDuration: 0.4 } as const
const fullYears = annualOfficialMacro.filter((row) => row.status === 'Tam il')
const maxGdp = Math.max(...fullYears.map((row) => row.gdp))

function yearNote(value: WbValue, selected: string) {
  if (!value.year) return 'Məlumat yoxdur'
  return value.year === selected ? `${value.year} · Dünya Bankı` : `Son məlumat: ${value.year} · Dünya Bankı`
}

export function Overview() {
  const f = useOutletContext<DashboardFilters>()
  const { year, selectedMacro: m, previousMacro: prev, isPartialYear, wbYear, wbTimeSeries } = f

  const fullIndex = fullYears.findIndex((row) => row.year === year)
  const nonOilShare = (m.nonOilGdp / m.gdp) * 100

  const kpis = [
    {
      label: 'Ümumi daxili məhsul',
      value: m.gdp / 1000,
      unit: 'mlrd AZN',
      change: m.growth,
      changeLabel: 'real artım',
      tone: 'blue' as const,
      spark: fullYears.map((r) => r.gdp),
      source: `${m.period} · real artım`,
    },
    {
      label: 'Qeyri-neft/qaz ÜDM',
      value: m.nonOilGdp / 1000,
      unit: 'mlrd AZN',
      change: m.nonOilGrowth,
      tone: 'green' as const,
      spark: fullYears.map((r) => r.nonOilGdp),
      source: `ÜDM-in ${azNumber(nonOilShare, 1)}%-i · real artım`,
    },
    {
      label: 'Sənaye məhsulu',
      value: m.industry / 1000,
      unit: 'mlrd AZN',
      change: pctDelta(m.industry, prev?.industry),
      changeLabel: isPartialYear ? 'qismən il' : undefined,
      tone: 'red' as const,
      spark: fullYears.map((r) => r.industry),
      source: prev ? `${prev.year}-ə görə nominal dəyişmə` : 'Tam illə müqayisə edilmir',
    },
    {
      label: 'Əsas kapitala investisiya',
      value: m.investment / 1000,
      unit: 'mlrd AZN',
      change: pctDelta(m.investment, prev?.investment),
      changeLabel: isPartialYear ? 'qismən il' : undefined,
      tone: 'amber' as const,
      spark: fullYears.map((r) => r.investment),
      source: prev ? `${prev.year}-ə görə nominal dəyişmə` : 'Tam illə müqayisə edilmir',
    },
  ]

  const wbSeries = (key: 'gdpUsd' | 'gdpPerCapita' | 'inflation' | 'unemployment') =>
    wbTimeSeries.map((p) => (key === 'gdpUsd' ? p.gdpUsd : key === 'gdpPerCapita' ? p.gdpPerCapita : key === 'inflation' ? p.inflation : p.unemployment) ?? 0)
  const wbIdx = (y: string | null) => wbTimeSeries.findIndex((p) => p.year === y)

  const insights = useMemo(() => {
    const list: string[] = []
    list.push(
      `${m.period} dövründə qeyri-neft/qaz sektoru ÜDM-in ${azNumber(nonOilShare, 1)}%-ni təşkil edib; neft-qaz hissəsi ${azNumber(m.oilGasGdp / 1000, 1)} mlrd AZN-dir.`,
    )
    if (prev) {
      const d = pctDelta(m.nonOilGdp, prev.nonOilGdp)
      list.push(
        `Qeyri-neft/qaz ÜDM-i ${prev.year}-ci illə müqayisədə nominal olaraq ${azNumber(d ?? 0, 1)}% ${
          (d ?? 0) >= 0 ? 'artıb' : 'azalıb'
        }, sənaye məhsulu isə ${azNumber(pctDelta(m.industry, prev.industry) ?? 0, 1)}% dəyişib.`,
      )
    } else if (isPartialYear) {
      list.push('Bu dövr tam il deyil, ona görə əvvəlki illərlə birbaşa müqayisə edilmir.')
    }
    if (wbYear.inflation.value !== null) {
      list.push(
        `Dünya Bankının məlumatına görə ${wbYear.inflation.year}-ci ildə inflyasiya ${azNumber(wbYear.inflation.value, 1)}%, işsizlik ${azNumber(
          wbYear.unemployment.value ?? 0,
          1,
        )}% olub.`,
      )
    }
    return list
  }, [m, prev, nonOilShare, isPartialYear, wbYear])

  return (
    <>
      {/* ───────── Hero ───────── */}
      <LiquidGlass as="section" className="hero" aria-label="Əsas göstərici">
        <div className="min-w-0">
          <div className="hero__kicker">
            <span>{m.period}</span>
            <span className={`chip ${isPartialYear ? 'chip--amber' : 'chip--green'}`}>{m.status}</span>
            <span className="chip">Dövlət Statistika Komitəsi</span>
          </div>
          <div className="hero__figure">
            <AnimatedNumber value={m.gdp / 1000} digits={1} className="hero__value" />
            <span className="hero__unit">mlrd AZN</span>
          </div>
          <p className="hero__lede">
            {isPartialYear
              ? 'Ümumi daxili məhsul, 2026-cı ilin ilk dörd ayı üzrə. Göstərici tam illik rəqəmlərlə müqayisə üçün nəzərdə tutulmayıb.'
              : `Azərbaycanın ${year}-ci il üzrə ümumi daxili məhsulu. Aşağıdakı il zolağından istənilən ili seçin: bütün panel, qrafiklər və sektor payları birlikdə yenilənir.`}
          </p>
          <div className="hero__stats">
            <div className="hero__stat">
              <small>Real ÜDM artımı</small>
              <strong className="num">{azNumber(m.growth, 1)}%</strong>
            </div>
            <div className="hero__stat">
              <small>Qeyri-neft/qaz artımı</small>
              <strong className="num">{azNumber(m.nonOilGrowth, 1)}%</strong>
            </div>
            <div className="hero__stat">
              <small>ÜDM, ABŞ dolları</small>
              <strong className="num">
                {wbYear.gdpUsd.value ? `${azNumber(wbYear.gdpUsd.value / 1e9, 1)} mlrd` : '—'}
              </strong>
              {wbYear.gdpUsd.year && wbYear.gdpUsd.year !== year ? (
                <em className="text-text-muted">{wbYear.gdpUsd.year}</em>
              ) : null}
            </div>
          </div>
        </div>

        <div className="hero__chart">
          <div className="hero__chart-head">
            <span>ÜDM, mlrd AZN · tam illər</span>
            <span className="inline-flex items-center gap-1.5 text-az-blue font-semibold">
              <MousePointerClick size={15} /> İli seçin
            </span>
          </div>
          <div style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={fullYears.map((r) => ({ year: r.year, gdp: r.gdp / 1000 }))}
                margin={{ top: 10, right: 8, bottom: 0, left: 8 }}
                onClick={(s) => {
                  const next = (s as { activeLabel?: string } | null)?.activeLabel
                  if (next) f.setYear(String(next))
                }}
                style={{ cursor: 'pointer' }}
              >
                <defs>
                  <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--az-blue)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--az-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" hide />
                <YAxis hide domain={[80, 'dataMax + 8']} />
                <Tooltip
                  content={<ChartTooltip valueFormatter={(v) => `${azNumber(v, 1)} mlrd AZN`} />}
                  cursor={{ stroke: 'var(--border-strong)', strokeDasharray: '3 3' }}
                />
                {fullIndex >= 0 ? <ReferenceLine x={year} stroke="var(--az-blue)" strokeDasharray="4 4" strokeOpacity={0.6} /> : null}
                <Area
                  type="monotone"
                  dataKey="gdp"
                  name="ÜDM"
                  stroke="var(--az-blue)"
                  strokeWidth={3}
                  fill="url(#heroFill)"
                  activeDot={{ r: 6, strokeWidth: 3, stroke: 'var(--bg-card)' }}
                  dot={(p: { cx?: number; cy?: number; payload?: { year: string } }) =>
                    p.payload?.year === year ? (
                      <circle key="a" cx={p.cx} cy={p.cy} r={6} fill="var(--az-blue)" stroke="var(--bg-card)" strokeWidth={3} />
                    ) : (
                      <g key={p.payload?.year} />
                    )
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="timeline" style={{ ['--count' as string]: years.length }} role="radiogroup" aria-label="İl seçimi">
            {years.map((y) => {
              const row = annualOfficialMacro.find((r) => r.year === y)!
              const partial = row.status !== 'Tam il'
              const h = partial ? 30 : 30 + (row.gdp / maxGdp) * 70
              const isActive = y === year
              return (
                <button
                  key={y}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`timeline__item press ${isActive ? 'is-active' : ''}`}
                  onClick={() => f.setYear(y)}
                >
                  {isActive ? <motion.span layoutId="timeline-lens" className="timeline__lens" transition={spring} /> : null}
                  <span className={`timeline__bar ${partial ? 'is-partial' : ''}`}>
                    <span style={{ height: `${h}%` }} />
                  </span>
                  <span className="timeline__year num">{y}</span>
                  <span className="timeline__note">{partial ? 'yan–apr' : `${azNumber(row.gdp / 1000, 0)}`}</span>
                </button>
              )
            })}
          </div>
        </div>
      </LiquidGlass>

      {isPartialYear ? (
        <div className="note">
          <AlertTriangle size={18} />
          <span>
            <strong>2026 tam il deyil.</strong> Göstəricilər yanvar–aprel dövrünə aiddir. Ona görə əvvəlki illə faiz
            müqayisəsi göstərilmir və il zolağında bu dövr ştrixlənib.
          </span>
        </div>
      ) : null}

      {/* ───────── Rəsmi KPI-lar ───────── */}
      <div className="grid-kpi">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} sparkActiveIndex={fullIndex} />
        ))}
      </div>

      <div className="section-title">
        <div>
          <h2>Dünya Bankı göstəriciləri</h2>
          <p>Beynəlxalq müqayisə üçün ABŞ dollarında və faizlə ifadə olunan göstəricilər. Hər kartda məlumatın aid olduğu il yazılıb.</p>
        </div>
        <SourceBadge f={f} />
      </div>

      <div className="grid-kpi">
        <KpiCard
          label="ÜDM, ABŞ dolları"
          value={wbYear.gdpUsd.value ? wbYear.gdpUsd.value / 1e9 : null}
          digits={2}
          unit="mlrd USD"
          tone="blue"
          spark={wbSeries('gdpUsd')}
          sparkActiveIndex={wbIdx(wbYear.gdpUsd.year)}
          source={yearNote(wbYear.gdpUsd, year)}
        />
        <KpiCard
          label="Adambaşına ÜDM"
          value={wbYear.gdpPerCapita.value}
          digits={0}
          unit="USD"
          tone="green"
          spark={wbSeries('gdpPerCapita')}
          sparkActiveIndex={wbIdx(wbYear.gdpPerCapita.year)}
          source={yearNote(wbYear.gdpPerCapita, year)}
        />
        <KpiCard
          label="İnflyasiya"
          value={wbYear.inflation.value}
          unit="%"
          tone="red"
          spark={wbSeries('inflation')}
          sparkActiveIndex={wbIdx(wbYear.inflation.year)}
          source={`İstehlak qiymətləri · ${yearNote(wbYear.inflation, year)}`}
        />
        <KpiCard
          label="İşsizlik"
          value={wbYear.unemployment.value}
          unit="%"
          tone="amber"
          spark={wbSeries('unemployment')}
          sparkActiveIndex={wbIdx(wbYear.unemployment.year)}
          source={`İşçi qüvvəsinin %-i · ${yearNote(wbYear.unemployment, year)}`}
        />
      </div>

      {/* ───────── Makro qrafik + sektor payları ───────── */}
      <div className="grid-2-1">
        <Panel
          id="live-dashboard"
          title="Rəsmi illik makro göstəricilər"
          subtitle="Dövlət Statistika Komitəsi · yanvar–dekabr, mlrd AZN"
          hint={
            <>
              <MousePointerClick size={15} /> İlə klikləyin — bütün panel həmin ilə keçir
            </>
          }
          extra={<span className="chip chip--green">Rəsmi statistika</span>}
          footer="2026-cı ilin qismən göstəriciləri tam illik trendə qoşulmur."
        >
          <div style={{ height: 330 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={fullYears.map((r) => ({
                  year: r.year,
                  gdp: r.gdp / 1000,
                  nonOilGdp: r.nonOilGdp / 1000,
                  industry: r.industry / 1000,
                  investment: r.investment / 1000,
                }))}
                margin={{ top: 12, right: 8, left: -8, bottom: 0 }}
                onClick={(s) => {
                  const next = (s as { activeLabel?: string } | null)?.activeLabel
                  if (next) f.setYear(String(next))
                }}
                style={{ cursor: 'pointer' }}
              >
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} width={44} />
                <Tooltip content={<ChartTooltip valueFormatter={(v) => `${azNumber(v, 1)} mlrd`} />} cursor={{ fill: 'var(--bg-hover)' }} />
                <Bar dataKey="industry" name="Sənaye məhsulu" radius={[8, 8, 3, 3]} maxBarSize={44}>
                  {fullYears.map((r) => (
                    <Cell
                      key={r.year}
                      fill={r.year === year ? 'var(--az-red)' : 'color-mix(in srgb, var(--az-red) 28%, transparent)'}
                    />
                  ))}
                </Bar>
                <Area type="monotone" dataKey="nonOilGdp" name="Qeyri-neft/qaz ÜDM" fill="var(--az-green)" fillOpacity={0.14} stroke="var(--az-green)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="investment" name="İnvestisiya" stroke="var(--slate)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="gdp"
                  name="ÜDM"
                  stroke="var(--az-blue)"
                  strokeWidth={3}
                  dot={(p: { cx?: number; cy?: number; payload?: { year: string } }) => (
                    <circle
                      key={p.payload?.year}
                      cx={p.cx}
                      cy={p.cy}
                      r={p.payload?.year === year ? 6 : 3.5}
                      fill="var(--az-blue)"
                      stroke="var(--bg-card)"
                      strokeWidth={p.payload?.year === year ? 3 : 0}
                    />
                  )}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <Legend
            items={[
              { label: 'ÜDM', color: 'var(--az-blue)', kind: 'line' },
              { label: 'Qeyri-neft/qaz ÜDM', color: 'var(--az-green)' },
              { label: 'Sənaye məhsulu', color: 'var(--az-red)' },
              { label: 'Əsas kapitala investisiya', color: 'var(--slate)', kind: 'dashed' },
            ]}
          />
        </Panel>

        <Panel
          title={`${year} ÜDM-in sektor strukturu`}
          subtitle="Payı açmaq üçün sektora klikləyin"
          extra={f.sector !== 'Hamısı' ? <span className="chip chip--blue">{f.sector}</span> : null}
        >
          {f.sectors.length ? (
            <div className="sector-list" key={year}>
              {f.sectors.map((item) => {
                const isActive = f.drillSector === item.sector || f.sector === item.sector
                return (
                  <button
                    key={item.sector}
                    type="button"
                    className={`sector-row press ${isActive ? 'is-active' : ''}`}
                    onClick={() => f.setDrillSector(item.sector)}
                  >
                    <span className="sector-row__name">
                      <span className="dot" style={{ background: sectorColor(item.sector) }} />
                      <span>{item.sector}</span>
                    </span>
                    <span className="sector-row__value num">{azNumber(item.share, 1)}%</span>
                    <span className="sector-row__track">
                      <span style={{ width: `${(item.share / 40) * 100}%`, background: sectorColor(item.sector) }} />
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="Bu il üçün sektor strukturu yoxdur"
              description={`${year}-ci il üzrə rəsmi sektor payları panelə daxil edilməyib. Struktur 2024, 2025 və 2026 üçün mövcuddur.`}
              action={
                <button type="button" className="pill-btn press" onClick={() => f.setYear('2025')}>
                  2025-ə keç <ArrowRight size={16} />
                </button>
              }
            />
          )}
        </Panel>
      </div>

      {/* ───────── Dünya Bankı trendi ───────── */}
      <Panel
        title="ÜDM, artım və inflyasiya — Dünya Bankı"
        subtitle="2015–2025 · sütunlar mlrd ABŞ dolları, xətlər faizlə"
        extra={<span className="chip chip--blue">Dünya Bankı</span>}
        hint={
          <>
            <MousePointerClick size={15} /> Panelin ili ilə sinxrondur
          </>
        }
      >
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={wbTimeSeries} margin={{ top: 12, right: 4, left: -4, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="year" {...axisProps} />
              <YAxis yAxisId="usd" {...axisProps} width={44} tickFormatter={(v) => `${Math.round(v / 1e9)}`} />
              <YAxis yAxisId="pct" orientation="right" {...axisProps} width={40} tickFormatter={(v) => `${azNumber(v, 0)}%`} />
              <Tooltip
                cursor={{ fill: 'var(--bg-hover)' }}
                content={
                  <ChartTooltip
                    valueFormatter={(v, name) => (name?.includes('USD') ? `${azNumber((v ?? 0) / 1e9, 2)} mlrd` : `${azNumber(v, 1)}%`)}
                  />
                }
              />
              <ReferenceLine yAxisId="pct" y={0} stroke="var(--border-strong)" />
              <Bar yAxisId="usd" dataKey="gdpUsd" name="ÜDM, USD" radius={[8, 8, 3, 3]} maxBarSize={36}>
                {wbTimeSeries.map((p) => (
                  <Cell key={p.year} fill={p.year === year ? 'var(--az-blue)' : 'color-mix(in srgb, var(--az-blue) 26%, transparent)'} />
                ))}
              </Bar>
              <Line yAxisId="pct" type="monotone" dataKey="gdpGrowthPct" name="Real artım" stroke="var(--az-green)" strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 0, fill: 'var(--az-green)' }} />
              <Line yAxisId="pct" type="monotone" dataKey="inflation" name="İnflyasiya" stroke="var(--az-red)" strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <Legend
          items={[
            { label: 'ÜDM, mlrd ABŞ dolları', color: 'var(--az-blue)' },
            { label: 'Real artım, %', color: 'var(--az-green)', kind: 'line' },
            { label: 'İnflyasiya, %', color: 'var(--az-red)', kind: 'dashed' },
          ]}
        />
      </Panel>

      <div className="grid-2">
        <Panel title="İxrac və idxal" subtitle="ÜDM-in %-i · Dünya Bankı" extra={<span className="chip chip--blue">Dünya Bankı</span>}>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wbTimeSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--az-green)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--az-green)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="impFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--az-blue)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--az-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} width={48} tickFormatter={(v) => `${azNumber(v, 0)}%`} />
                <Tooltip content={<ChartTooltip valueFormatter={(v) => `${azNumber(v, 1)}%`} />} />
                <ReferenceLine x={year} stroke="var(--border-strong)" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="exports" name="İxrac" stroke="var(--az-green)" fill="url(#expFill)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="imports" name="İdxal" stroke="var(--az-blue)" fill="url(#impFill)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Legend
            items={[
              { label: 'İxrac, ÜDM-in %-i', color: 'var(--az-green)' },
              { label: 'İdxal, ÜDM-in %-i', color: 'var(--az-blue)' },
            ]}
          />
        </Panel>

        <Panel title="Qərar üçün siqnallar" subtitle="Seçilmiş ilin rəqəmlərindən avtomatik qurulur" extra={<Lightbulb size={20} className="text-amber" />}>
          <ul className="prose-list">
            {insights.map((text) => (
              <li key={text}>
                <ArrowRight size={16} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="note note--blue mt-4">
            <Lightbulb size={18} />
            <span>
              Siqnal qərarın özü deyil: göstəricini qərara çevirməzdən əvvəl mənbəni, dövrü və sektor detalını yoxlayın.
            </span>
          </div>
        </Panel>
      </div>

      <SectorDrilldown
        open={Boolean(f.drillSector)}
        sector={f.drillSector}
        year={year}
        shares={f.officialSectorShares}
        macro={m}
        onClose={() => f.setDrillSector(null)}
        onApplySectorFilter={f.applySectorFilter}
        onSelectPeer={(name) => f.setDrillSector(name)}
      />
    </>
  )
}

function SourceBadge({ f }: { f: DashboardFilters }) {
  const label =
    f.wbSource === 'live'
      ? `Canlı API · ${f.fetchedAt?.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}`
      : f.wbSource === 'cache'
        ? 'Keşdən'
        : `Ehtiyat nüsxə · ${WB_SNAPSHOT_DATE.split('-').reverse().join('.')}`
  return (
    <span className="flex items-center gap-2 no-print">
      <span className={`chip ${f.wbSource === 'live' ? 'chip--green' : 'chip--amber'}`}>
        <span className={`dot ${f.wbSource === 'live' ? 'dot--live' : ''}`} style={{ background: 'currentColor' }} />
        {f.wbLoading ? 'Yüklənir…' : label}
      </span>
      {f.wbSource !== 'live' && !f.wbLoading ? (
        <button type="button" className="icon-btn press" style={{ width: 32, height: 32 }} onClick={f.refetchWb} aria-label="Yenidən yüklə">
          <RefreshCw size={15} />
        </button>
      ) : null}
    </span>
  )
}
