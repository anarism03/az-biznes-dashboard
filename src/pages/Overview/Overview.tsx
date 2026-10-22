import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { App as AntApp, Badge, Button, Progress, Tag } from 'antd'
import { ArrowUpRight, Download, RadioTower, RefreshCw } from 'lucide-react'
import { ChartCard } from '../../components/ui/ChartCard'
import { KpiCard } from '../../components/ui/KpiCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { FilterChips } from '../../components/ui/FilterChips'
import { SectorDrilldown } from '../../components/ui/SectorDrilldown'
import { annualOfficialMacro } from '../../data/dashboardData'
import { sectorColor } from '../../utils/formatters'
import { useOverview } from './useOverview'
import { ApiKpiCard, DarkTooltip } from './components'
import { fmt, usdBillion } from './utils'

export function Overview() {
  const { message } = AntApp.useApp()
  const {
    year,
    setSector,
    drillSector,
    setDrillSector,
    sectors,
    selectedMacro,
    wbYear,
    wbLoading,
    wbError,
    wbTimeSeries,
    fetchedAt,
    officialSectorShares,
    selectedIndicators,
    dskKpis,
    downloadReport,
    scrollToPanel,
    handleYearSelect,
    openSectorDrill,
    clearFilters,
    sector,
  } = useOverview(message)

  return (
    <div className="flex flex-col gap-6">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <span className="brand-mark">AzərDash</span>
          <span className="eyebrow">Qərarvermə üçün interaktiv vizual analitika</span>
          <h2>Biznes Analitikası üzrə Tədqiqat Paneli</h2>
          <p>
            Rəsmi makro göstəricilər və Dünya Bankı məlumatları ilə linked KPI paneli: filtr,
            cross-highlight, sektor drill-down və hesabat çıxışı bir mühitdə.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <Button type="primary" icon={<RadioTower size={17} />} onClick={scrollToPanel}>
              Panelə keç
            </Button>
            <Button icon={<Download size={17} />} onClick={downloadReport}>
              Hesabat çıxışı
            </Button>
          </div>
        </div>
        <div className="hero-panel__chart">
          <div>
            <small>
              {selectedMacro.period} · Dövlət Statistika Komitəsi
            </small>
            <strong>{fmt(selectedMacro.gdp / 1000)} mlrd AZN</strong>
            <span>
              Qeyri-neft artımı: {fmt(selectedMacro.nonOilGrowth)}% · Neft/qaz ÜDM:{' '}
              {fmt(selectedMacro.oilGasGdp / 1000)} mlrd AZN
            </span>
            {wbYear?.gdpUsd ? (
              <span className="hero-panel__wb">≈ {usdBillion(wbYear.gdpUsd)} (Dünya Bankı)</span>
            ) : null}
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={annualOfficialMacro}
              margin={{ top: 8, right: 4, bottom: 0, left: -18 }}
              onClick={(state) => {
                const next = (state as { activeLabel?: string } | null)?.activeLabel
                if (next) handleYearSelect(String(next))
              }}
              style={{ cursor: 'pointer' }}
            >
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} />
              <YAxis hide />
              <Tooltip content={<DarkTooltip valueFormatter={(v) => fmt((v ?? 0) / 1000, 1)} />} />
              <Area
                type="monotone"
                dataKey="gdp"
                name="ÜDM (mln AZN)"
                stroke="var(--az-blue)"
                strokeWidth={2.5}
                fill="var(--az-blue)"
                fillOpacity={0.15}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <FilterChips
        year={year}
        sector={sector}
        drillSector={drillSector}
        onClearSector={() => setSector('Hamısı')}
        onClearDrill={() => setDrillSector(null)}
        onReset={clearFilters}
      />

      <div className="source-status">
        <Badge
          status={wbLoading ? 'processing' : wbError ? 'error' : 'success'}
          color={wbLoading ? '#b45309' : wbError ? 'var(--az-red)' : 'var(--az-green)'}
        />
        <span>Məlumat mənbələri:</span>
        Dünya Bankı Open Data · Dövlət Statistika Komitəsi
        {fetchedAt && !wbLoading ? (
          <span className="source-status__time">
            <RefreshCw size={10} /> {fetchedAt.toLocaleTimeString('az-AZ')}-də yeniləndi
          </span>
        ) : null}
        {wbError ? <span className="source-status__error">Məlumat xətası: {wbError}</span> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dskKpis.map((item) => (
          <KpiCard key={item.label} {...item} />
        ))}
      </div>

      <div className="section-heading">
        <span />
        <h3>Dünya Bankı Göstəriciləri</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ApiKpiCard label="ÜDM (ABŞ dolları)" loading={wbLoading}>
          <div className="kpi-value">{wbYear ? usdBillion(wbYear.gdpUsd) : '—'}</div>
        </ApiKpiCard>
        <ApiKpiCard label="Adambaşına ÜDM" loading={wbLoading}>
          <div className="kpi-value">{wbYear?.gdpPerCapita ? `${fmt(wbYear.gdpPerCapita, 0)} USD` : '—'}</div>
        </ApiKpiCard>
        <ApiKpiCard label="İnflyasiya" loading={wbLoading}>
          <div className="kpi-value">
            {wbYear?.inflation !== null && wbYear?.inflation !== undefined ? `${fmt(wbYear.inflation)}%` : '—'}
          </div>
          <div className="kpi-caption">İstehlakçı qiymətləri</div>
        </ApiKpiCard>
        <ApiKpiCard label="İşsizlik" loading={wbLoading}>
          <div className="kpi-value">
            {wbYear?.unemployment !== null && wbYear?.unemployment !== undefined
              ? `${fmt(wbYear.unemployment)}%`
              : '—'}
          </div>
          <div className="kpi-caption">İşçi qüvvəsinin %-i</div>
        </ApiKpiCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <ChartCard
          id="live-dashboard"
          title="Rəsmi illik makro göstəricilər"
          subtitle="Dövlət Statistika Komitəsi · yanvar-dekabr, milyon AZN"
          hint="İlə klikləyin — bütün panel sinxron filtrələnir"
          extra={<Tag color="green">DSK rəsmi data</Tag>}
        >
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart
              data={annualOfficialMacro}
              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
              onClick={(state) => {
                const next = (state as { activeLabel?: string } | null)?.activeLabel
                if (next) handleYearSelect(String(next))
              }}
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 12 }} />
              <Bar dataKey="industry" name="Sənaye məhsulu" radius={[2, 2, 0, 0]}>
                {annualOfficialMacro.map((item) => (
                  <Cell
                    key={item.year}
                    fill={item.year === year ? 'var(--az-red)' : 'color-mix(in srgb, var(--az-red) 35%, transparent)'}
                    stroke={item.year === year ? 'var(--az-red)' : 'transparent'}
                    strokeWidth={item.year === year ? 1 : 0}
                  />
                ))}
              </Bar>
              <Area
                type="monotone"
                dataKey="nonOilGdp"
                name="Qeyri-neft/qaz ÜDM"
                fill="var(--az-green)"
                fillOpacity={0.15}
                stroke="var(--az-green)"
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="investment" name="İnvestisiya" stroke="#64748b" strokeDasharray="5 5" dot={false} />
              <Line
                type="monotone"
                dataKey="gdp"
                name="ÜDM"
                stroke="var(--az-blue)"
                strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  const active = payload?.year === year
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={active ? 5 : 3}
                      fill="var(--az-blue)"
                      stroke={active ? 'var(--bg-card)' : 'transparent'}
                      strokeWidth={active ? 2 : 0}
                    />
                  )
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={`${year} ÜDM sektor payları`}
          subtitle="Klik → drill-down detal"
          hint="Sektor seçimi digər filtrlərlə əlaqəlidir"
        >
          {sectors.length ? (
            <div className="sector-list">
              {sectors.map((item) => {
                const active = drillSector === item.sector || sector === item.sector
                return (
                  <button
                    key={item.sector}
                    type="button"
                    className={`sector-score sector-score--button ${active ? 'is-active' : ''}`}
                    onClick={() => openSectorDrill(item.sector)}
                  >
                    <div>
                      <span style={{ background: sectorColor(item.sector) }} />
                      <strong>{item.sector}</strong>
                    </div>
                    <Progress
                      percent={item.share}
                      strokeColor={sectorColor(item.sector)}
                      railColor="var(--border)"
                      size="small"
                    />
                    <small>ÜDM payı: {fmt(item.share)}%</small>
                  </button>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="Sektor payı yoxdur"
              description={`${year} ili üçün sektor payı paneldə yoxdur. Soldakı qrafikdə illik makro göstəricilər verilib.`}
              action={
                <Button size="small" onClick={() => handleYearSelect('2025')}>
                  2025-ə keç
                </Button>
              }
            />
          )}
        </ChartCard>
      </div>

      {wbLoading && !wbTimeSeries.length ? (
        <ChartCard title="ÜDM dinamikası — Dünya Bankı" subtitle="Yüklənir...">
          <EmptyState title="World Bank məlumatı yüklənir" description="Açıq API cavabı gözlənilir. Keş varsa dərhal göstərilir." />
        </ChartCard>
      ) : null}

      {!wbLoading && wbError && !wbTimeSeries.length ? (
        <ChartCard title="ÜDM dinamikası — Dünya Bankı" subtitle="API əlçatan deyil">
          <EmptyState
            title="World Bank məlumatı alınmadı"
            description={wbError}
          />
        </ChartCard>
      ) : null}

      {wbTimeSeries.length > 0 ? (
        <ChartCard
          title="ÜDM dinamikası — Dünya Bankı"
          subtitle="İllik trend · kliklə il seçin"
          extra={<Tag color="blue">Dünya Bankı</Tag>}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={wbTimeSeries}
              margin={{ top: 12, right: 16, left: 0, bottom: 0 }}
              onClick={(state) => {
                const next = (state as { activeLabel?: string } | null)?.activeLabel
                if (next) handleYearSelect(String(next))
              }}
              style={{ cursor: 'pointer' }}
            >
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
              <YAxis
                yAxisId="gdp"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--chart-tick)', fontSize: 10 }}
                tickFormatter={(v) => (v ? `$${(v / 1e9).toFixed(0)}mlrd` : '')}
              />
              <YAxis
                yAxisId="pct"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--chart-tick)', fontSize: 10 }}
                tickFormatter={(v) => `${Number(v).toFixed(1)}%`}
              />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 12 }} />
              <Bar yAxisId="gdp" dataKey="gdpUsd" name="ÜDM (USD)" radius={[2, 2, 0, 0]}>
                {wbTimeSeries.map((item) => (
                  <Cell
                    key={item.year}
                    fill={item.year === year ? 'var(--az-blue)' : 'color-mix(in srgb, var(--az-blue) 35%, transparent)'}
                  />
                ))}
              </Bar>
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="gdpGrowthPct"
                name="Real artım (%)"
                stroke="var(--az-green)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'var(--az-green)', strokeWidth: 0 }}
              />
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="inflation"
                name="İnflyasiya (%)"
                stroke="var(--az-red)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}

      {wbTimeSeries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="İxrac və İdxal dinamikası" subtitle="ÜDM-in %-i · Dünya Bankı" extra={<Tag color="blue">Dünya Bankı</Tag>}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={wbTimeSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} tickFormatter={(v) => `${Number(v).toFixed(0)}%`} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Area type="monotone" dataKey="exports" name="İxrac (%)" stroke="var(--az-green)" fill="var(--az-green)" fillOpacity={0.14} strokeWidth={2} />
                <Area type="monotone" dataKey="imports" name="İdxal (%)" stroke="var(--az-blue)" fill="var(--az-blue)" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="İşsizlik nisbəti" subtitle="İşçi qüvvəsinin %-i · Dünya Bankı" extra={<Tag color="blue">Dünya Bankı</Tag>}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={wbTimeSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} tickFormatter={(v) => `${Number(v).toFixed(1)}%`} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="unemployment" name="İşsizlik (%)" stroke="var(--az-red)" fill="var(--az-red)" fillOpacity={0.14} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title={`${selectedMacro.period} göstəriciləri`} subtitle="Dövlət Statistika Komitəsi · milyon AZN">
          {selectedIndicators.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={selectedIndicators} margin={{ top: 12, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={70} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--chart-tick)', fontSize: 11 }} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="value" name="Göstərici (mln AZN)" radius={[4, 4, 0, 0]}>
                  {selectedIndicators.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={index < 2 ? 'var(--az-blue)' : index < 5 ? 'var(--az-green)' : 'var(--az-red)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Göstərici yoxdur" description="Seçilmiş dövr üçün göstərici siyahısı boşdur." />
          )}
        </ChartCard>

        <ChartCard title="Qərar siqnalı" subtitle="Dashboarddan idarəetmə tövsiyəsi">
          <div className="flex flex-col items-start gap-2.5 h-full">
            <ArrowUpRight size={32} className="text-az-blue" />
            <h3 className="text-[15px] font-bold text-text-primary leading-snug font-display">
              Diqqət: qeyri-neft sektorlarında drill-down analiz
            </h3>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              Qeyri-neft/qaz artımı və İKT adaptasiyası dashboard layihələrində ayrıca izlənməlidir.
              Sektor payına klikləyin — detal paneli açılır, filtr və linked qrafiklər sinxron qalır.
            </p>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              <Tag color="green">KPI</Tag>
              <Tag color="blue">Drill-down</Tag>
              <Tag color="gold">Data quality</Tag>
              {wbYear ? <Tag color="cyan">Dünya Bankı</Tag> : null}
            </div>
          </div>
        </ChartCard>
      </div>

      <SectorDrilldown
        open={Boolean(drillSector)}
        sector={drillSector}
        year={year}
        shares={officialSectorShares}
        macro={selectedMacro}
        onClose={() => setDrillSector(null)}
        onApplySectorFilter={(name) => {
          setSector(name)
          setDrillSector(name)
        }}
      />
    </div>
  )
}
