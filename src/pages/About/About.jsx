import { Card, Col, Row, Typography } from 'antd'
import { Info, BarChart3, TrendingUp, Users } from 'lucide-react'

const { Title, Paragraph, Text } = Typography

export function About() {
  return (
    <div className="page-stack max-w-5xl mx-auto p-4 md:p-8">
      <Card variant="borderless" className="shadow-sm rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-[#00b5e2] via-[#e4002b] to-[#009b77] shadow-md">
            <Info size={24} />
          </div>
          <Title level={2} className="!text-text-primary !m-0">Haqqımızda</Title>
        </div>
        
        <Paragraph className="!text-text-secondary !text-[16px] !leading-relaxed">
          AzərDash bizneslər üçün müasir, çevik və güclü idarəetmə panelidir (dashboard). Bu platforma rəhbərlərə və komandalara öz qərarlarını sadəcə təxminlərə deyil, dəqiq və real vaxtda yenilənən rəqəmlərə əsaslanaraq verməyə kömək edir.
        </Paragraph>
        <Paragraph className="!text-text-secondary !text-[16px] !leading-relaxed">
          <strong>Bəs biz tam olaraq nə edirik?</strong> Dağınıq, mürəkkəb Excel cədvəllərini və anlaşılamayan məlumat yığınlarını təmiz, sadə və baxanda hər kəsin anlaya biləcəyi vizual qrafiklərə çeviririk. Məqsədimiz şirkətlərin satış, maliyyə, əməliyyat və digər mühüm göstəricilərini (KPI) tək bir ekranda cəmləyərək, rəhbərliyin işini yüngülləşdirməkdir. Qısacası, biznesinizi sizin üçün görünən və ölçülə bilən hala gətiririk.
        </Paragraph>

        <Title level={3} className="!text-text-primary !mt-10 !mb-6">Bizim Üstünlüklərimiz</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="p-5 h-full bg-base rounded-xl border border-border transition-colors hover:border-teal">
              <div className="text-teal mb-3"><TrendingUp size={28} /></div>
              <Title level={5} className="!text-text-primary !mb-2">Real Vaxt İzləməsi</Title>
              <Text className="!text-text-secondary">Dashboardlar məlumatların birbaşa olaraq sürətli yenilənməsi ilə işləyir və qərarların gecikməsinin qarşısını alır.</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-5 h-full bg-base rounded-xl border border-border transition-colors hover:border-teal">
              <div className="text-teal mb-3"><BarChart3 size={28} /></div>
              <Title level={5} className="!text-text-primary !mb-2">Ağıllı Vizuallaşdırma</Title>
              <Text className="!text-text-secondary">D3.js, Recharts, və digər alətlərlə ən mürəkkəb məlumatların vizual təsviri istifadəçiyə tam aydın olur.</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-5 h-full bg-base rounded-xl border border-border transition-colors hover:border-teal">
              <div className="text-teal mb-3"><Users size={28} /></div>
              <Title level={5} className="!text-text-primary !mb-2">Premium UI/UX</Title>
              <Text className="!text-text-secondary">Müasir texnologiyalar və rəng ahəngdarlığı ilə təmiz, aydın və intuitiv interfeys təcrübəsi.</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
