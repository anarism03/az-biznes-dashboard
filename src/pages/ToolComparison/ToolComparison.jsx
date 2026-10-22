import { Card, Table, Tag } from 'antd'
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
import { ChartCard } from '../../components/ui/ChartCard'
import { platformComparison } from '../../data/dashboardData'

const columns = [
  { title: 'Platforma', dataIndex: 'tool', render: (value) => <strong>{value}</strong> },
  { title: 'Governance', dataIndex: 'governance', sorter: (a, b) => a.governance - b.governance },
  { title: 'Modeling', dataIndex: 'modeling', sorter: (a, b) => a.modeling - b.modeling },
  { title: 'İnteqrasiya', dataIndex: 'integration', sorter: (a, b) => a.integration - b.integration },
  { title: 'Xərc üstünlüyü', dataIndex: 'cost', sorter: (a, b) => a.cost - b.cost },
  { title: 'Xüsusiləşdirmə', dataIndex: 'custom', sorter: (a, b) => a.custom - b.custom },
  { title: 'Ən uyğun istifadə', dataIndex: 'bestFor' },
]

export function ToolComparison() {
  const scored = platformComparison.map((item) => ({
    ...item,
    total: Math.round((item.governance + item.modeling + item.integration + item.cost + item.custom) / 5),
  }))

  return (
    <div className="page-stack">

      <div className="analytics-grid two-one">
        <ChartCard title="Platforma skoru" subtitle="5 kriteriyanın orta balı">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={scored} layout="vertical" margin={{ top: 12, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="tool" tickLine={false} axisLine={false} width={78} />
              <Tooltip />
              <Bar dataKey="total" name="Ümumi skor" fill="#0f766e" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="tool-pick-card" variant="borderless">
          <Tag color="green">Tövsiyə</Tag>
          <h3>Biznes analitikası üçün hibrid yanaşma</h3>
          <p>
            Korporativ tətbiqdə Power BI və ya Looker idarəetmə üstünlüyü verir. Müasir biznes və
            xüsusi interaktiv qrafiklər üçün React + Recharts/D3 yanaşması daha çevik və sürətlidir.
          </p>
          <div className="mini-score">
            <span>Governance</span>
            <strong>92</strong>
          </div>
          <div className="mini-score">
            <span>Xüsusiləşdirmə</span>
            <strong>99</strong>
          </div>
        </Card>
      </div>

      <ChartCard title="Funksional müqayisə cədvəli" subtitle="Sıralana bilən seçim matrisi">
        <Table columns={columns} dataSource={platformComparison} pagination={false} />
      </ChartCard>

      <ChartCard title="Kriteriyalar üzrə detal müqayisə" subtitle="Platformaların güclü və zəif tərəfləri">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={platformComparison} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="tool" tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="governance" name="Governance" fill="#0f766e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="integration" name="İnteqrasiya" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="custom" name="Xüsusiləşdirmə" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
