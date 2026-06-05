import { Card, Descriptions, Table, Tag } from 'antd'
import { ExternalLink } from 'lucide-react'
import { ChartCard } from '../components/ui/ChartCard.jsx'
import { chapterMap, recommendations, sourceLinks } from '../data/dashboardData.js'

const sourceColumns = [
  {
    title: 'Mənbə',
    dataIndex: 'name',
    render: (value, row) => (
      <a href={row.url.startsWith('http') ? row.url : undefined} target="_blank" rel="noreferrer">
        {value} {row.url.startsWith('http') && <ExternalLink size={13} />}
      </a>
    ),
  },
  { title: 'İstifadə məqsədi', dataIndex: 'detail' },
]

export function ReportsPage() {
  return (
    <div className="page-stack">

      <div className="chapter-grid">
        {chapterMap.map((chapter) => (
          <Card key={chapter.title} className="chapter-card" variant="borderless">
            <Tag color="cyan">{chapter.title}</Tag>
            <h3>{chapter.subtitle}</h3>
            <ul className="plain-list">
              {chapter.points.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="analytics-grid">
        <ChartCard title="Nəticə və təkliflər" subtitle="Praktiki tətbiq üçün tövsiyələr">
          <ol className="recommendation-list">
            {recommendations.map((item, index) => (
              <li key={item}>
                <span>{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </ChartCard>

        <Card className="export-card" variant="borderless">
          <h3>Hesabat paketi</h3>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Format">Çox səhifəli React dashboard</Descriptions.Item>
            <Descriptions.Item label="UI sistemi">Tailwind CSS + Ant Design tokenləri</Descriptions.Item>
            <Descriptions.Item label="Qrafiklər">Recharts, interaktiv tooltip, filtrli dataset</Descriptions.Item>
            <Descriptions.Item label="Mövzu">Rəqəmsal Biznes Analitikası və İdarəetmə Paneli</Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <ChartCard title="Real resurs və məlumat xətti" subtitle="Dashboarddakı rəsmi və metodoloji mənbələr">
        <Table columns={sourceColumns} dataSource={sourceLinks.map((item) => ({ ...item, key: item.name }))} pagination={false} />
      </ChartCard>
    </div>
  )
}
