import { useOutletContext } from 'react-router-dom'
import { Alert, Card, Col, Row, Statistic, Tag } from 'antd'
import {
  Area,
  AreaChart,
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
import { annualOfficialMacro } from '../data/dashboardData.js'
import { azNumber } from '../utils/formatters.js'

export function EmpiricalStudyPage() {
  const { selectedMacro } = useOutletContext()
  const fullYearRows = annualOfficialMacro.filter((item) => item.status === 'Tam il')
  const currentRows = annualOfficialMacro.filter((item) => item.status !== 'Tam il')
  const comparisonRows = fullYearRows.map((item) => ({
    year: item.year,
    gdp: item.gdp,
    nonOilGdp: item.nonOilGdp,
    industry: item.industry,
    investment: item.investment,
    growth: item.growth,
    nonOilGrowth: item.nonOilGrowth,
    status: item.status,
  }))

  return (
    <div className="page-stack">

      <Alert
        type="info"
        showIcon
        title="Sorğu datası haqqında"
        description="Dissertasiya üzrə ayrıca respondent datası daxil edilməyib. Ona görə bu səhifədə yalnız rəsmi makro göstəricilər göstərilir."
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="stat-card" variant="borderless">
            <Statistic title={selectedMacro.period} value={selectedMacro.gdp / 1000} precision={1} suffix="mlrd AZN" />
            <span>Ümumi daxili məhsul</span>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="stat-card" variant="borderless">
            <Statistic title="Qeyri-neft/qaz artımı" value={selectedMacro.nonOilGrowth} precision={1} suffix="%" />
            <span>Rəsmi real artım göstəricisi</span>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="stat-card" variant="borderless">
            <Statistic title="Status" value={selectedMacro.status} />
            <span>{selectedMacro.source}</span>
          </Card>
        </Col>
      </Row>

      <div className="analytics-grid">
        <ChartCard title="ÜDM və qeyri-neft/qaz ÜDM" subtitle="Tam il göstəriciləri: 2021-2025">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={comparisonRows} margin={{ top: 12, right: 12, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${azNumber(value / 1000, 0)} mlrd`} tick={{ fill: '#64748b' }} />
              <Tooltip formatter={(value) => `${azNumber(value, 1)} mln AZN`} />
              <Legend />
              <Area type="monotone" dataKey="gdp" name="ÜDM" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.12} />
              <Area type="monotone" dataKey="nonOilGdp" name="Qeyri-neft/qaz ÜDM" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Real artım fərqləri" subtitle="Tam il göstəriciləri: 2021-2025">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={comparisonRows} margin={{ top: 12, right: 12, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip formatter={(value) => `${azNumber(value, 1)}%`} />
              <Legend />
              <Bar dataKey="growth" name="ÜDM artımı" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="nonOilGrowth" name="Qeyri-neft/qaz artımı" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="İllər üzrə qeyd" subtitle="Hər il üçün data dövrü və mənbə ayrıca saxlanılır">
        <div className="year-note-grid">
          {annualOfficialMacro.map((item) => (
            <div key={item.year} className="year-note-card">
              <Tag color={item.status === 'Tam il' ? 'green' : 'gold'}>{item.status}</Tag>
              <h3>{item.year}</h3>
              <p>{item.period}</p>
              <span>{item.source}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {currentRows.length > 0 && (
        <ChartCard title="2026 cari dövr" subtitle="Tam il deyil, yanvar-aprel dövrü üzrə rəsmi göstəricidir">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={currentRows} margin={{ top: 12, right: 12, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${azNumber(value / 1000, 0)} mlrd`} />
              <Tooltip formatter={(value) => `${azNumber(value, 1)} mln AZN`} />
              <Legend />
              <Bar dataKey="gdp" name="ÜDM" fill="#0f766e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="nonOilGdp" name="Qeyri-neft/qaz ÜDM" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  )
}
