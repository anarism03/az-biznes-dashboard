import { useOutletContext } from 'react-router-dom'
import { Card, Col, Row, Table, Tag, Timeline } from 'antd'
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
import { ChartCard } from '../components/ui/ChartCard.jsx'
import { PageIntro } from '../components/ui/PageIntro.jsx'
import { kpiRows } from '../data/dashboardData.js'
import { azNumber, sectorColor } from '../utils/formatters.js'

const columns = [
  { title: 'Perspektiv', dataIndex: 'perspective', render: (value) => <Tag color="cyan">{value}</Tag> },
  { title: 'KPI', dataIndex: 'kpi' },
  { title: 'Vizual forma', dataIndex: 'chart' },
  { title: 'Qərar istifadəsi', dataIndex: 'decision' },
]

export function KpiFrameworkPage() {
  const { sectors, selectedMacro, year } = useOutletContext()
  const indicatorRows = [
    { name: 'ÜDM', value: selectedMacro.gdp },
    { name: 'Qeyri-neft/qaz ÜDM', value: selectedMacro.nonOilGdp },
    { name: 'Sənaye', value: selectedMacro.industry },
    { name: 'Qeyri-neft sənayesi', value: selectedMacro.nonOilIndustry },
    { name: 'İnvestisiya', value: selectedMacro.investment },
    { name: 'Kənd təsərrüfatı', value: selectedMacro.agriculture },
  ]

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Fəsil II · KPI çərçivəsi"
        title="KPI modeli rəsmi göstəricilər üzərində qurulur."
        description="Bu səhifədə metrik lüğəti, rəsmi göstəricilər və sektor payları birlikdə verilir. Model və uydurma şirkət datası istifadə olunmur."
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15}>
          <ChartCard title="KPI lüğəti və vizual kodlaşdırma" subtitle="Dashboard qurulmazdan əvvəl metrik adı, mənbə və formula aydın olmalıdır">
            <Table columns={columns} dataSource={kpiRows} pagination={false} scroll={{ x: 860 }} />
          </ChartCard>
        </Col>
        <Col xs={24} lg={9}>
          <ChartCard title="KPI qurma ardıcıllığı" subtitle="Metrikdən qərara qədər">
            <Timeline
              items={[
                { color: 'teal', children: 'Biznes sualı və qərar sahibi müəyyən edilir' },
                { color: 'blue', children: 'Metrik formulu, mənbə sistemi və yenilənmə dövrü yazılır' },
                { color: 'gold', children: 'Vizual tip göstəricinin məqsədinə görə seçilir' },
                { color: 'green', children: 'Nəticə qərar sahibi və hesabat çıxışı ilə bağlanır' },
              ]}
            />
          </ChartCard>
        </Col>
      </Row>

      <div className="analytics-grid">
        <ChartCard title={`${selectedMacro.period} üzrə KPI bazası`} subtitle="Dövlət Statistika Komitəsi, milyon manat">
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={indicatorRows} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} interval={0} angle={-16} textAnchor="end" height={64} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => `${azNumber(value, 1)} mln AZN`} />
              <Legend />
              <Bar dataKey="value" name="Göstərici" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

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
            <div className="empty-search">
              Bu il üçün sektor payı panelə daxil edilməyib. KPI bazası kimi rəsmi illik makro göstəricilər istifadə olunur.
            </div>
          )}
        </ChartCard>
      </div>

      <Card className="method-card" variant="borderless">
        <h3>Metodoloji qeyd</h3>
        <p>
          KPI panelində rəsmi göstərici ilə metodoloji izah ayrılır. Rəqəm Dövlət Statistika
          Komitəsinin dərc etdiyi göstəricidirsə, mənbə və dövr göstərilir. Sorğu və ya şirkət
          datası daxil edilməyibsə, panel həmin nəticəni rəsmi data kimi təqdim etmir.
        </p>
      </Card>
    </div>
  )
}
