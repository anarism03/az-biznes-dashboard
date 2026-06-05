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
import { ChartCard } from '../components/ui/ChartCard.jsx'
import { KpiCard } from '../components/ui/KpiCard.jsx'
import { SourceStrip } from '../components/ui/SourceStrip.jsx'
import { annualOfficialMacro } from '../data/dashboardData.js'
import { exportDashboardExcel } from '../utils/exportData.js'
import { azNumber, sectorColor } from '../utils/formatters.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(val, dec = 1) {
  if (val === null || val === undefined) return '—'
  return azNumber(val, dec)
}

function usdBillion(val) {
  if (!val) return '—'
  return `${azNumber(val / 1e9, 2)} mlrd USD`
}

// Real məlumatlar üçün skeleton KPI card
function ApiKpiCard({ label, value, unit, badge = 'Canlı', tone = 'teal', loading, positive = true, children }) {
  return (
    <div className={`kpi-card tone-${tone}`} style={{ minHeight: 160 }}>
      <div className="kpi-glow" />
      <div className="kpi-row">
        <span>{label}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 8px', borderRadius: 999,
          background: 'rgba(20,184,166,0.12)',
          border: '1px solid rgba(20,184,166,0.3)',
          color: 'var(--teal)', fontSize: 11, fontWeight: 700,
        }}>
          <Globe size={10} /> {badge}
        </span>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} style={{ marginTop: 8 }} />
      ) : (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {value}
          </div>
          {unit && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{unit}</div>
          )}
          {children}
        </div>
      )}
      <small style={{ marginTop: 12, display: 'block' }}>Dünya Bankı Open Data</small>
    </div>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-md)',
      borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{p.value !== null ? azNumber(p.value, 1) : '—'}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function OverviewPage() {
  const { message } = AntApp.useApp()
  const filters = useOutletContext()
  const { year, sector, sectors, selectedMacro, wbYear, wbLoading, wbError, wbTimeSeries, fetchedAt } = filters

  const selectedIndicators = [
    { name: 'ÜDM', value: selectedMacro.gdp },
    { name: 'Qeyri-neft ÜDM', value: selectedMacro.nonOilGdp },
    { name: 'Sənaye', value: selectedMacro.industry },
    { name: 'Q/N sənaye', value: selectedMacro.nonOilIndustry },
    { name: 'İnvestisiya', value: selectedMacro.investment },
    { name: 'K/T', value: selectedMacro.agriculture },
    selectedMacro.transportStorage ? { name: 'Nəqliyyat', value: selectedMacro.transportStorage } : null,
    selectedMacro.ictServices ? { name: 'İKT', value: selectedMacro.ictServices } : null,
    selectedMacro.retailTrade ? { name: 'Ticarət', value: selectedMacro.retailTrade } : null,
  ].filter(Boolean)

  const dskKpis = [
    {
      label: 'ÜDM (AZN)',
      value: selectedMacro.gdp / 1000,
      unit: 'mlrd AZN',
      change: selectedMacro.growth,
      source: selectedMacro.source,
      tone: 'teal',
    },
    {
      label: 'Qeyri-neft/qaz ÜDM',
      value: selectedMacro.nonOilGdp / 1000,
      unit: 'mlrd AZN',
      change: selectedMacro.nonOilGrowth,
      source: 'Dövlət Statistika Komitəsi',
      tone: 'blue',
    },
    {
      label: 'Sənaye məhsulu',
      value: selectedMacro.industry / 1000,
      unit: 'mlrd AZN',
      change: 0,
      changeText: selectedMacro.status,
      source: 'Dövlət Statistika Komitəsi',
      tone: 'amber',
    },
    {
      label: 'Əsas kapital investisiya',
      value: selectedMacro.investment / 1000,
      unit: 'mlrd AZN',
      change: 0,
      changeText: selectedMacro.status,
      source: 'Dövlət Statistika Komitəsi',
      tone: 'rose',
    },
  ]

  const downloadReport = () => {
    exportDashboardExcel(filters)
    message.success('Hesabat Excel formatında endirildi')
  }

  const scrollToPanel = () => {
    document.getElementById('live-dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 items-center rounded-[20px] p-6 md:p-9 relative overflow-hidden border border-border bg-card shadow-md transition-colors duration-250 before:content-[''] before:absolute before:-top-[60px] before:-right-[60px] before:w-[240px] before:h-[240px] before:rounded-full before:bg-[radial-gradient(circle,rgba(15,118,110,0.08)_0%,transparent_70%)] dark:before:bg-[radial-gradient(circle,rgba(20,184,166,0.10)_0%,transparent_70%)] before:pointer-events-none">
        <div className="flex flex-col gap-3.5">
          <span className="eyebrow">Azərbaycan biznes analitikası</span>
          <h2>Data vizuallaşdırma qərarı daha tez və daha aydın izah etməyə kömək edir.</h2>
          <p>
            Dashboard dissertasiyada qurulan nəzəri xətti praktik nümunə kimi göstərir:
            KPI, sektor payları, alət seçimi, empirik nəticə və data governance eyni paneldə izlənilir.
            Qlobal iqtisadi göstəricilər Dünya Bankından (Canlı), ətraflı statistika isə Dövlət Statistika Komitəsindən əldə olunur.
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

      {/* ── Data source strip ─────────────────────── */}
      <div className="flex items-center gap-2 py-2 px-4 rounded-xl bg-card border border-border text-xs text-text-secondary font-medium flex-wrap transition-colors duration-250">
        <Badge status={wbLoading ? 'processing' : wbError ? 'error' : 'success'}
               color={wbLoading ? '#f59e0b' : wbError ? '#f43f5e' : '#14b8a6'} />
        <span>Məlumat mənbələri:</span>
        Dünya Bankı Qlobal Məlumat Binası (Canlı) ·
        Dövlət Statistika Komitəsi (yerli, rəsmi)
        {fetchedAt && !wbLoading && (
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={10} /> {fetchedAt.toLocaleTimeString('az-AZ')}-də yeniləndi
          </span>
        )}
        {wbError && <span style={{ color: '#f43f5e', fontSize: 12 }}>Məlumat xətası: {wbError}</span>}
      </div>

      {/* ── DSK KPI cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dskKpis.map(item => (
          <KpiCard key={item.label} {...item} />
        ))}
      </div>

      {/* ── World Bank API real göstəricilər ──────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
        <div style={{ width: 3, height: 24, background: 'linear-gradient(135deg,#14b8a6,#0ea5e9)', borderRadius: 999 }} />
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 15, fontWeight: 700 }}>
          Dünya Bankı Qlobal Göstəricilər — Canlı Məlumatlar
        </h3>
        <span style={{
          padding: '2px 10px', borderRadius: 999,
          background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.25)',
          color: 'var(--teal)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Globe size={10} /> {year} il üçün
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ApiKpiCard label="ÜDM (ABŞ dolları)" loading={wbLoading} tone="teal">
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear ? usdBillion(wbYear.gdpUsd) : '—'}
          </div>
          {wbYear?.gdpGrowth !== null && wbYear?.gdpGrowth !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {wbYear.gdpGrowth >= 0
                ? <TrendingUp size={13} style={{ color: '#10b981' }} />
                : <TrendingDown size={13} style={{ color: '#f43f5e' }} />}
              <span style={{ fontSize: 12, color: wbYear.gdpGrowth >= 0 ? '#10b981' : '#f43f5e', fontWeight: 600 }}>
                {wbYear.gdpGrowth >= 0 ? '+' : ''}{fmt(wbYear.gdpGrowth)}% artım
              </span>
            </div>
          )}
        </ApiKpiCard>

        <ApiKpiCard label="Adambaşına ÜDM" loading={wbLoading} tone="blue">
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.gdpPerCapita ? `${fmt(wbYear.gdpPerCapita, 0)} USD` : '—'}
          </div>
        </ApiKpiCard>

        <ApiKpiCard label="İnflyasiya" loading={wbLoading} tone="amber">
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.inflation !== null && wbYear?.inflation !== undefined ? `${fmt(wbYear.inflation)}%` : '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>İstehlakçı qiymətləri</div>
        </ApiKpiCard>

        <ApiKpiCard label="İşsizlik" loading={wbLoading} tone="rose">
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.unemployment !== null && wbYear?.unemployment !== undefined ? `${fmt(wbYear.unemployment)}%` : '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>İşçi qüvvəsinin %-i</div>
        </ApiKpiCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ApiKpiCard label="İxrac (ÜDM-in %-i)" loading={wbLoading} tone="teal">
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.exports !== null && wbYear?.exports !== undefined ? `${fmt(wbYear.exports)}%` : '—'}
          </div>
        </ApiKpiCard>
        <ApiKpiCard label="İdxal (ÜDM-in %-i)" loading={wbLoading} tone="blue">
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.imports !== null && wbYear?.imports !== undefined ? `${fmt(wbYear.imports)}%` : '—'}
          </div>
        </ApiKpiCard>
        <ApiKpiCard label="Birbaşa Xarici İnvestisiya" loading={wbLoading} tone="violet" badge="BXİ · Canlı">
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
            {wbYear?.fdi !== null && wbYear?.fdi !== undefined ? `${fmt(wbYear.fdi)}%` : '—'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>ÜDM-in %-i</div>
        </ApiKpiCard>
      </div>

      {/* ── Makro illik qrafik (DSK) ──────────────── */}
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

      {/* ── World Bank time series qrafik ────────── */}
      {wbTimeSeries.length > 0 && (
        <ChartCard
          title="ÜDM dinamikası — Dünya Bankı"
          subtitle="İllik trend və proqnozlar"
          extra={<Tag color="cyan" icon={<Globe size={11} />}>Canlı Data</Tag>}
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

      {/* ── İxrac/idxal + İşsizlik ───────────────── */}
      {wbTimeSeries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChartCard title="İxrac və İdxal dinamikası" subtitle="ÜDM-in %-i · Dünya Bankı" extra={<Tag color="cyan"><Globe size={10} /> Canlı Data</Tag>}>
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

          <ChartCard title="İşsizlik nisbəti" subtitle="İşçi qüvvəsinin %-i · Dünya Bankı" extra={<Tag color="cyan"><Globe size={10} /> Canlı Data</Tag>}>
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

      {/* ── DSK dövrü göstəriciləri ───────────────── */}
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
