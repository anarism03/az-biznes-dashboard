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
import { App as AntApp, Button, Progress, Tag } from 'antd'
import { ArrowUpRight, Download, RadioTower } from 'lucide-react'
import { ChartCard } from '../components/ui/ChartCard.jsx'
import { KpiCard } from '../components/ui/KpiCard.jsx'
import { PageIntro } from '../components/ui/PageIntro.jsx'
import { SourceStrip } from '../components/ui/SourceStrip.jsx'
import { annualOfficialMacro } from '../data/dashboardData.js'
import { exportDashboardExcel } from '../utils/exportData.js'
import { azCurrency, azNumber, sectorColor } from '../utils/formatters.js'

export function OverviewPage() {
  const { message } = AntApp.useApp()
  const filters = useOutletContext()
  const { year, sector, sectors, selectedMacro } = filters
  const selectedKpis = [
    {
      label: 'ÜDM istehsalı',
      value: selectedMacro.gdp / 1000,
      unit: 'mlrd AZN',
      change: selectedMacro.growth,
      source: selectedMacro.source,
    },
    {
      label: 'Qeyri-neft/qaz ÜDM',
      value: selectedMacro.nonOilGdp / 1000,
      unit: 'mlrd AZN',
      change: selectedMacro.nonOilGrowth,
      source: selectedMacro.source,
    },
    {
      label: 'Sənaye məhsulu',
      value: selectedMacro.industry / 1000,
      unit: 'mlrd AZN',
      change: 0,
      changeText: selectedMacro.status,
      source: selectedMacro.source,
    },
    {
      label: 'Əsas kapitala investisiya',
      value: selectedMacro.investment / 1000,
      unit: 'mlrd AZN',
      change: 0,
      changeText: selectedMacro.status,
      source: selectedMacro.source,
    },
  ]
  const selectedIndicators = [
    { name: 'ÜDM', value: selectedMacro.gdp },
    { name: 'Qeyri-neft/qaz ÜDM', value: selectedMacro.nonOilGdp },
    { name: 'Sənaye', value: selectedMacro.industry },
    { name: 'Qeyri-neft sənayesi', value: selectedMacro.nonOilIndustry },
    { name: 'Əsas kapitala investisiya', value: selectedMacro.investment },
    { name: 'Kənd təsərrüfatı', value: selectedMacro.agriculture },
    selectedMacro.transportStorage ? { name: 'Nəqliyyat və anbar', value: selectedMacro.transportStorage } : null,
    selectedMacro.ictServices ? { name: 'İnformasiya və rabitə', value: selectedMacro.ictServices } : null,
    selectedMacro.retailTrade ? { name: 'Pərakəndə ticarət', value: selectedMacro.retailTrade } : null,
  ].filter(Boolean)

  const scrollToLivePanel = () => {
    document.getElementById('live-dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const downloadReport = () => {
    exportDashboardExcel(filters)
    message.success('Hesabat Excel formatında endirildi')
  }

  return (
    <div className="page-stack">
      <section className="executive-hero">
        <div className="hero-copy">
          <span className="eyebrow">Azərbaycan biznes analitikası</span>
          <h2>Data vizuallaşdırma qərarı daha tez və daha aydın izah etməyə kömək edir.</h2>
          <p>
            Dashboard dissertasiyada qurulan nəzəri xətti praktik nümunə kimi göstərir:
            KPI, sektor payları, alət seçimi, empirik nəticə və data governance eyni paneldə
            izlənilir.
          </p>
          <div className="hero-actions">
            <Button type="primary" icon={<RadioTower size={17} />} onClick={scrollToLivePanel}>Panelə keç</Button>
            <Button icon={<Download size={17} />} onClick={downloadReport}>Hesabat çıxışı</Button>
          </div>
        </div>
        <div className="hero-panel">
          <div>
            <small>{selectedMacro.period} üzrə rəsmi ÜDM göstəricisi</small>
            <strong>{azNumber(selectedMacro.gdp / 1000, 1)} mlrd AZN</strong>
            <span>
              Qeyri-neft/qaz ÜDM: {azNumber(selectedMacro.nonOilGdp / 1000, 1)} mlrd AZN · artım {azNumber(selectedMacro.nonOilGrowth, 1)}%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={annualOfficialMacro} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
              <defs>
                <linearGradient id="overviewRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.48} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#667085' }} />
              <YAxis hide />
              <Tooltip formatter={(value) => `${azNumber(value / 1000, 1)} mlrd AZN`} />
              <Area type="monotone" dataKey="gdp" stroke="#0f766e" strokeWidth={3} fill="url(#overviewRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <SourceStrip />

      <div className="kpi-grid">
        {selectedKpis.map((item, index) => (
          <KpiCard
            key={item.label}
            {...item}
            tone={['teal', 'blue', 'amber', 'rose'][index]}
          />
        ))}
      </div>

      <div className="analytics-grid two-one">
        <ChartCard
          id="live-dashboard"
          title="Rəsmi illik makro göstəricilər"
          subtitle="Dövlət Statistika Komitəsi · yanvar-dekabr göstəriciləri, milyon manat"
          extra={<Tag color="cyan">Real data</Tag>}
        >
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={annualOfficialMacro} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#667085', fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#667085', fontSize: 11 }} />
              <Tooltip formatter={(value, name) => [`${azNumber(value, 1)} mln AZN`, name]} />
              <Legend />
              <Bar dataKey="industry" name="Sənaye məhsulu" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              <Area type="monotone" dataKey="nonOilGdp" name="Qeyri-neft/qaz ÜDM" fill="#d1fae5" stroke="#16803c" strokeWidth={2} />
              <Line type="monotone" dataKey="investment" name="Əsas kapitala investisiya" stroke="#475467" strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="gdp" name="ÜDM" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`${year} ÜDM sektor payları`} subtitle={`${selectedMacro.period} · Dövlət Statistika Komitəsi, faizlə`}>
          <div className="sector-list">
            {sectors.length ? sectors.map((item) => (
              <div key={item.sector} className="sector-score">
                <div>
                  <span style={{ background: sectorColor(item.sector) }} />
                  <strong>{item.sector}</strong>
                </div>
                <Progress
                  percent={item.share}
                  strokeColor={sectorColor(item.sector)}
                  railColor="#eaecf0"
                  size="small"
                />
                <small>ÜDM payı: {azNumber(item.share, 1)}%</small>
              </div>
            )) : (
              <div className="empty-search">
                Bu il üçün sektor payı paneldə yoxdur. Rəsmi illik makro göstəricilər soldakı qrafikdə verilib.
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="analytics-grid">
        <ChartCard title={`${selectedMacro.period} göstəriciləri`} subtitle="Rəsmi makro göstəricilər, milyon manat">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={selectedIndicators} margin={{ top: 12, right: 12, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#667085', fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={70} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#667085', fontSize: 11 }} />
              <Tooltip formatter={(value) => `${azNumber(value, 1)} mln AZN`} />
              <Bar dataKey="value" name="Göstərici">
                {selectedIndicators.map((item, index) => (
                  <Cell key={item.name} fill={index < 2 ? '#0f766e' : index < 5 ? '#2563eb' : '#b45309'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Qərar siqnalı" subtitle="Dashboarddan idarəetmə tövsiyəsi">
          <div className="decision-card">
            <ArrowUpRight size={34} />
          <h3>Diqqət: qeyri-neft sektorlarında drill-down analiz</h3>
          <p>
              Qeyri-neft/qaz artımı və İKT adaptasiyası dashboard layihələrində ayrıca izlənməlidir.
              Sektor payı dəyişən sahələr üçün səbəb-nəticə analizi ayrıca açılmalıdır.
          </p>
            <div>
              <Tag color="green">KPI</Tag>
              <Tag color="blue">Drill-down</Tag>
              <Tag color="gold">Data quality</Tag>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
