import { Card, Descriptions, Table, Tag } from 'antd'
import { ExternalLink } from 'lucide-react'
import { ChartCard } from '../../components/ui/ChartCard.jsx'
import { chapterMap, recommendations, sourceLinks } from '../../data/dashboardData.js'

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

export function Reports() {
  return (
    <div className="page-stack">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {chapterMap.map((chapter) => (
          <Card key={chapter.title} className="bg-card border border-border shadow-sm" variant="borderless">
            <Tag color="cyan">{chapter.title}</Tag>
            <h3>{chapter.subtitle}</h3>
            <ul className="mt-4 flex flex-col gap-2 pl-0 list-none m-0 text-text-secondary text-[13px]">
              {chapter.points.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-6 mt-2">
        <ChartCard title="Nəticə və təkliflər" subtitle="Praktiki tətbiq üçün tövsiyələr">
          <ol className="flex flex-col gap-3 pl-0 list-none m-0 text-[14px] text-text-secondary">
            {recommendations.map((item, index) => (
              <li key={item}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue/10 text-blue font-bold text-[12px] mr-3">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </ChartCard>

      </div>

      <ChartCard title="Real resurs və məlumat xətti" subtitle="Dashboarddakı rəsmi və metodoloji mənbələr">
        <Table columns={sourceColumns} dataSource={sourceLinks.map((item) => ({ ...item, key: item.name }))} pagination={false} />
      </ChartCard>
    </div>
  )
}
