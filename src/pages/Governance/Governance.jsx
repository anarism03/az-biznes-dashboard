import { Card, Progress, Steps, Tag } from 'antd'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { ChartCard } from '../../components/ui/ChartCard'
import { governanceLayers } from '../../data/dashboardData'

export function Governance() {
  return (
    <div className="page-stack">

      <ChartCard title="Dashboardun data xətti" subtitle="Mənbədən göstəriciyə, göstəricidən qərara">
        <div className="architecture-flow">
          {governanceLayers.map((item, index) => (
            <div key={item.layer} className="architecture-node">
              <div className="node-index">{index + 1}</div>
              <h3>{item.layer}</h3>
              <p>{item.text}</p>
              <Progress percent={item.status} strokeColor={item.status > 85 ? 'var(--az-green)' : 'var(--az-red)'} />
            </div>
          ))}
        </div>
      </ChartCard>

      <div className="analytics-grid two-one">
        <Card className="governance-card" variant="borderless">
          <ShieldCheck size={34} />
          <h3>Data keyfiyyəti qaydaları</h3>
          <ul>
            <li><CheckCircle2 size={16} /> Mənbə sistemi və KPI sahibi sənədləşdirilir.</li>
            <li><CheckCircle2 size={16} /> Hər göstərici üçün formula və yenilənmə tezliyi ayrıca yazılır.</li>
            <li><CheckCircle2 size={16} /> Null, dublikat və kənarlaşma testləri ETL mərhələsində edilir.</li>
            <li><CheckCircle2 size={16} /> Dashboardda son yenilənmə vaxtı və etibar səviyyəsi görünür.</li>
          </ul>
        </Card>

        <ChartCard title="İdarəetmə modeli" subtitle="RACI məntiqi ilə analitika rolları">
          <Steps
            orientation="vertical"
            current={3}
            items={[
              { title: 'Data sahibi', content: 'Mənbə və keyfiyyət məsuliyyəti' },
              { title: 'BI analitik', content: 'Model, vizual kodlaşdırma və test' },
              { title: 'Biznes rəhbəri', content: 'KPI hədəfi və qərar mövzusu' },
              { title: 'İcra komandası', content: 'Tövsiyə, tədbir və nəticə üzrə geribildirim' },
            ]}
          />
        </ChartCard>
      </div>

      <Card className="method-card" variant="borderless">
        <Tag color="gold">Risk xəbərdarlığı</Tag>
        <h3>Garbage in, garbage out prinsipi</h3>
        <p>
          Dissertasiyanın metodoloji xəttinə görə vizual interfeys son mərhələdir. Data keyfiyyəti,
          metrik tərifi və semantik model zəifdirsə, qrafik nə qədər yaxşı görünsə də, qərarı
          səhv istiqamətə apara bilər. Bu səbəbdən governance ayrıca səhifə kimi saxlanılıb.
        </p>
      </Card>
    </div>
  )
}
