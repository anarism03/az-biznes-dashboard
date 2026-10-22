import { useOutletContext } from 'react-router-dom'
import { Card, Col, Row, Skeleton, Table, Tag, Timeline } from 'antd'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Globe } from 'lucide-react'
import { ChartCard } from '../../components/ui/ChartCard'
import { kpiRows } from '../../data/dashboardData'
import { azNumber, sectorColor } from '../../utils/formatters'

const columns = [
  { title: 'Perspektiv', dataIndex: 'perspective', render: (value) => <Tag color="cyan">{value}</Tag> },
  { title: 'KPI', dataIndex: 'kpi' },
  { title: 'Vizual forma', dataIndex: 'chart' },
  { title: 'Qərar istifadəsi', dataIndex: 'decision' },
]

export function KpiFramework() {
  const { sectors, selectedMacro, year, wbYear, wbLoading, wbTimeSeries } = useOutletContext()
  const indicatorRows = [
    { name: 'ÜDM', value: selectedMacro.gdp },
    { name: 'Qeyri-neft/qaz ÜDM', value: selectedMacro.nonOilGdp },
    { name: 'Sənaye', value: selectedMacro.industry },
    { name: 'Qeyri-neft sənayesi', value: selectedMacro.nonOilIndustry },
    { name: 'İnvestisiya', value: selectedMacro.investment },
    { name: 'Kənd təsərrüfatı', value: selectedMacro.agriculture },
  ]

  const wbBarData = (wbTimeSeries || [])
    .filter(d => d.gdpUsd)
    .map(d => ({ year: d.year, gdp_mlrd: +(d.gdpUsd / 1e9).toFixed(2) }))

  return (
    <div className="page-stack">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {[
          { label: 'ÜDM (USD)', value: wbYear?.gdpUsd ? `$${(wbYear.gdpUsd / 1e9).toFixed(1)} mlrd` : '—' },
          { label: 'Real artım', value: wbYear?.gdpGrowth != null ? `${azNumber(wbYear.gdpGrowth, 1)}%` : '—' },
          { label: 'İnflyasiya', value: wbYear?.inflation != null ? `${azNumber(wbYear.inflation, 1)}%` : '—' },
          { label: 'İşsizlik', value: wbYear?.unemployment != null ? `${azNumber(wbYear.unemployment, 1)}%` : '—' },
        ].map(item => (
          <div key={item.label} style={{
            padding: 16, borderRadius: 12,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              {item.label}
            </div>
            {wbLoading ? (
              <Skeleton active title={{ width: '70%' }} paragraph={false} />
            ) : (
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
            )}

            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>{year} · Dünya Bankı</div>
          </div>
        ))}
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <ChartCard title="KPI lüğəti və vizual kodlaşdırma" subtitle="Dashboard qurulmazdan əvvəl metrik adı, mənbə və formula aydın olmalıdır">
            <Table columns={columns} dataSource={kpiRows} pagination={false} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={9}>
          <ChartCard title="KPI qurma ardıcıllığı" subtitle="Metrikdən qərara qədər">
            <Timeline
              items={[
                { color: 'teal', content: 'Biznes sualı və qərar sahibi müəyyən edilir' },
                { color: 'blue', content: 'Metrik formulu, mənbə sistemi və yenilənmə dövrü yazılır' },
                { color: 'gold', content: 'Vizual tip göstəricinin məqsədinə görə seçilir' },
                { color: 'green', content: 'Nəticə qərar sahibi və hesabat çıxışı ilə bağlanır' },
              ]}
            />
          </ChartCard>
        </Col>
      </Row>

      <div className="analytics-grid">
        <ChartCard title={`${selectedMacro.period} üzrə KPI bazası`} subtitle="Dövlət Statistika Komitəsi, milyon AZN">
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={indicatorRows} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-16} textAnchor="end" height={64} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip formatter={(value) => `${azNumber(value, 1)} mln AZN`} />
              <Legend />
              <Bar dataKey="value" name="Göstərici (mln AZN)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {wbBarData.length > 0 ? (
          <ChartCard title="ÜDM dinamikası (USD) — Dünya Bankı" subtitle="İllik trend, milyard ABŞ dolları">
            <ResponsiveContainer width="100%" height={310}>
              <BarChart data={wbBarData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={(v) => [`$${v} mlrd`, 'ÜDM (USD)']} />
                <Bar dataKey="gdp_mlrd" name="ÜDM (mlrd USD)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : (
          <ChartCard title={`${year} sektor payları`} subtitle="Rəsmi ÜDM strukturu mövcuddursa göstərilir">
            {sectors.length ? (
              <div className="sector-list">
                {sectors.map((item) => (
                  <div key={item.sector} className="sector-score">
                    <div>
                      <span style={{ background: sectorColor(item.sector) }} />
                      <strong>{item.sector}</strong>
                    </div>
                    <div className="share-track">
                      <span style={{ width: `${item.share}%`, background: sectorColor(item.sector) }} />
                    </div>
                    <small>{azNumber(item.share, 1)}%</small>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-search">Bu il üçün sektor payı panelə daxil edilməyib.</div>
            )}
          </ChartCard>
        )}
      </div>

      <Card className="method-card" variant="borderless">
        <h3>Metodoloji qeyd</h3>
        <p>
          KPI panelində rəsmi göstərici ilə metodoloji izah ayrılır. Rəqəm Dövlət Statistika
          Komitəsinin dərc etdiyi göstəricidirsə, mənbə və dövr göstərilir. Dünya Bankı Open Data
          API-si (api.worldbank.org) vasitəsilə ÜDM (USD), artım faizi, inflyasiya və işsizlik
          göstəriciləri real vaxtda yüklənir.
        </p>
      </Card>
    </div>
  )
}
