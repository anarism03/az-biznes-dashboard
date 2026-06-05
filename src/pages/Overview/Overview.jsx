import { useOutletContext } from 'react-router-dom'
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
import { App as AntApp, Badge, Button, Progress, Skeleton, Tag } from 'antd'
import { ArrowUpRight, Download, Globe, RadioTower, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { ChartCard } from '../../components/ui/ChartCard.jsx'
import { KpiCard } from '../../components/ui/KpiCard.jsx'
import { SourceStrip } from '../../components/ui/SourceStrip.jsx'
import { annualOfficialMacro } from '../../data/dashboardData.js'
import { exportDashboardExcel } from '../../utils/exportData.js'
import { azNumber, sectorColor } from '../../utils/formatters.js'
import { useOverview } from './useOverview.js'
import { ApiKpiCard, DarkTooltip } from './components.jsx'
import { fmt, usdBillion } from './utils.js'
export function Overview() {
  const { message } = AntApp.useApp()
  const {
    year, sectors, selectedMacro, wbYear, wbLoading, wbError, wbTimeSeries, fetchedAt, wbData,
    selectedIndicators, dskKpis, downloadReport, scrollToPanel
  } = useOverview(message)

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 items-center rounded-[20px] p-6 md:p-9 relative overflow-hidden border border-border bg-card shadow-md transition-colors duration-250 before:content-[''] before:absolute before:-top-[60px] before:-right-[60px] before:w-[240px] before:h-[240px] before:rounded-full before:bg-[radial-gradient(circle,rgba(15,118,110,0.08)_0%,transparent_70%)] dark:before:bg-[radial-gradient(circle,rgba(20,184,166,0.10)_0%,transparent_70%)] before:pointer-events-none">
        <div className="flex flex-col gap-3.5">
          <span className="eyebrow">Azərbaycan biznes analitikası</span>
          <h2>Biznes Analitikası üzrə Tədqiqat Paneli</h2>
          <p>
            Bu idarəetmə paneli makroiqtisadi göstəricilərin və sektor paylarının vizual təhlili üçün hazırlanmışdır.
            Burada həm Dünya Bankının qlobal iqtisadi məlumatları, həm də Dövlət Statistika Komitəsinin rəsmi statistikası öz əksini tapıb.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <Button type="primary" icon={<RadioTower size={17} />} onClick={scrollToPanel}>Panelə keç</Button>
            <Button icon={<Download size={17} />} onClick={downloadReport}>Hesabat çıxışı</Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-surface border border-border rounded-xl p-5 shadow-sm transition-colors duration-250">
          <div>
            <small className="text-[10px] font-semibold text-text-muted uppercase tracking-wider transition-colors duration-250">{selectedMacro.period} · Dövlət Statistika Komitəsi</small>
            <strong className="block text-[28px] font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-text-primary to-teal leading-tight transition-all duration-250">{fmt(selectedMacro.gdp / 1000)} mlrd AZN</strong>
            <span className="text-[11px] text-text-secondary leading-relaxed transition-colors duration-250">Qeyri-neft artımı: {fmt(selectedMacro.nonOilGrowth)}% · Neft/qaz ÜDM: {fmt(selectedMacro.oilGasGdp / 1000)} mlrd AZN</span>
            {wbYear?.gdpUsd && (
              <span className="block mt-2 text-teal text-[13px] font-semibold">
                ≈ {usdBillion(wbYear.gdpUsd)} (Dünya Bankı)
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={annualOfficialMacro} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis hide />
              <Tooltip content={<DarkTooltip />} formatter={(v) => fmt(v / 1000, 1)} />
              <Area type="monotone" dataKey="gdp" name="ÜDM (mln AZN)" stroke="#14b8a6" strokeWidth={2.5} fill="url(#heroGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="flex items-center gap-2 py-2 px-4 rounded-xl bg-card border border-border text-xs text-text-secondary font-medium flex-wrap transition-colors duration-250">
        <Badge status={wbLoading ? 'processing' : wbError ? 'error' : 'success'}
               color={wbLoading ? '#f59e0b' : wbError ? '#f43f5e' : '#14b8a6'} />
        <span>Məlumat mənbələri:</span>
        Dünya Bankı Open Data · Dövlət Statistika Komitəsi
        {fetchedAt && !wbLoading && (
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={10} /> {fetchedAt.toLocaleTimeString('az-AZ')}-də yeniləndi
          </span>
        )}
        {wbError && <span style={{ color: '#f43f5e', fontSize: 12 }}>Məlumat xətası: {wbError}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dskKpis.map(item => (
          <KpiCard key={item.label} {...item} />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 mb-2">
        <div style={{ width: 3, height: 20, background: '#1677ff', borderRadius: 999 }} />
        <h3 className="text-[15px] font-bold text-text-primary m-0">Dünya Bankı Göstəriciləri</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ApiKpiCard label="ÜDM (ABŞ dolları)" loading={wbLoading}>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear ? usdBillion(wbYear.gdpUsd) : '—'}
          </div>
        </ApiKpiCard>
        <ApiKpiCard label="Adambaşına ÜDM" loading={wbLoading}>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.gdpPerCapita ? `${fmt(wbYear.gdpPerCapita, 0)} USD` : '—'}
          </div>
        </ApiKpiCard>
        <ApiKpiCard label="İnflyasiya" loading={wbLoading}>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.inflation !== null && wbYear?.inflation !== undefined ? `${fmt(wbYear.inflation)}%` : '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>İstehlakçı qiymətləri</div>
        </ApiKpiCard>
        <ApiKpiCard label="İşsizlik" loading={wbLoading}>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.unemployment !== null && wbYear?.unemployment !== undefined ? `${fmt(wbYear.unemployment)}%` : '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>İşçi qüvvəsinin %-i</div>
        </ApiKpiCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <ChartCard
          id="live-dashboard"
          title="Rəsmi illik makro göstəricilər"
          subtitle="Dövlət Statistika Komitəsi · yanvar-dekabr, milyon AZN"
          extra={<Tag color="green">DSK rəsmi data</Tag>}
        >
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={annualOfficialMacro} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 12 }} />
              <Bar dataKey="industry" name="Sənaye məhsulu" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Area type="monotone" dataKey="nonOilGdp" name="Qeyri-neft/qaz ÜDM" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="investment" name="İnvestisiya" stroke="#64748b" strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="gdp" name="ÜDM" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 3, fill: '#14b8a6', strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`${year} ÜDM sektor payları`} subtitle="Dövlət Statistika Komitəsi, faizlə">
          <div className="sector-list">
            {sectors.length ? sectors.map(item => (
              <div key={item.sector} className="sector-score">
                <div>
                  <span style={{ background: sectorColor(item.sector) }} />
                  <strong>{item.sector}</strong>
                </div>
                <Progress
                  percent={item.share}
                  strokeColor={sectorColor(item.sector)}
                  railColor="rgba(255,255,255,0.06)"
                  size="small"
                />
                <small>ÜDM payı: {fmt(item.share)}%</small>
              </div>
            )) : (
              <div className="empty-search">
                Bu il üçün sektor payı paneldə yoxdur. Soldakı qrafikdə illik makro göstəricilər verilib.
              </div>
            )}
          </div>
        </ChartCard>
      </div>


      {wbTimeSeries.length > 0 && (
        <ChartCard
          title="ÜDM dinamikası — Dünya Bankı"
          subtitle="İllik trend və proqnozlar"
          extra={<Tag color="blue">Dünya Bankı</Tag>}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={wbTimeSeries} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis
                yAxisId="gdp"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={v => v ? `$${(v / 1e9).toFixed(0)}mlrd` : ''}
              />
              <YAxis
                yAxisId="pct"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={v => `${v?.toFixed(1)}%`}
              />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 12 }} />
              <Bar yAxisId="gdp" dataKey="gdpUsd" name="ÜDM (USD)" fill="#14b8a6" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
              <Line yAxisId="pct" type="monotone" dataKey="gdpGrowthPct" name="Real artım (%)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
              <Line yAxisId="pct" type="monotone" dataKey="inflation" name="İnflyasiya (%)" stroke="#f43f5e" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}


      {wbTimeSeries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="İxrac və İdxal dinamikası" subtitle="ÜDM-in %-i · Dünya Bankı" extra={<Tag color="blue">Dünya Bankı</Tag>}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={wbTimeSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `${v?.toFixed(0)}%`} />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Area type="monotone" dataKey="exports" name="İxrac (%)" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.12} strokeWidth={2} />
                <Area type="monotone" dataKey="imports" name="İdxal (%)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="İşsizlik nisbəti" subtitle="İşçi qüvvəsinin %-i · Dünya Bankı" extra={<Tag color="blue">Dünya Bankı</Tag>}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={wbTimeSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `${v?.toFixed(1)}%`} />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="unemployment" name="İşsizlik (%)" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title={`${selectedMacro.period} göstəriciləri`} subtitle="Dövlət Statistika Komitəsi · milyon AZN">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={selectedIndicators} margin={{ top: 12, right: 12, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={70} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="value" name="Göstərici (mln AZN)" radius={[4, 4, 0, 0]}>
                {selectedIndicators.map((item, index) => (
                  <Cell key={item.name} fill={index < 2 ? '#14b8a6' : index < 5 ? '#3b82f6' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Qərar siqnalı" subtitle="Dashboarddan idarəetmə tövsiyəsi">
          <div className="flex flex-col items-start gap-2.5 h-full">
            <ArrowUpRight size={32} className="text-teal transition-colors duration-250" />
            <h3 className="text-[15px] font-bold text-text-primary leading-snug transition-colors duration-250">Diqqət: qeyri-neft sektorlarında drill-down analiz</h3>
            <p className="text-[13px] leading-relaxed text-text-secondary transition-colors duration-250">
              Qeyri-neft/qaz artımı və İKT adaptasiyası dashboard layihələrində ayrıca izlənməlidir.
              Sektor payı dəyişən sahələr üçün səbəb-nəticə analizi ayrıca açılmalıdır.
            </p>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              <Tag color="green">KPI</Tag>
              <Tag color="blue">Drill-down</Tag>
              <Tag color="gold">Data quality</Tag>
              {wbYear && <Tag color="cyan">Dünya Bankı</Tag>}
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
