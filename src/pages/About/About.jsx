import { Card, Col, Row, Typography } from 'antd'
import { BarChart3, TrendingUp, Users } from 'lucide-react'
import { BrandLogo } from '../../components/brand/BrandLogo'

const { Title, Paragraph, Text } = Typography

export function About() {
  return (
    <div className="page-stack max-w-5xl mx-auto p-4 md:p-8">
      <Card variant="borderless" className="shadow-sm rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-3 mb-6">
          <BrandLogo size={48} title="AzərDash" />
          <Title level={2} className="!text-text-primary !m-0 font-display">Haqqımızda</Title>
        </div>

        <Paragraph className="!text-text-secondary !text-[16px] !leading-relaxed">
          AzərDash bizneslər üçün müasir, çevik və güclü idarəetmə panelidir (dashboard). Bu platforma rəhbərlərə və komandalara öz qərarlarını sadəcə təxminlərə deyil, dəqiq və real vaxtda yenilənən rəqəmlərə əsaslanaraq verməyə kömək edir.
        </Paragraph>
        <Paragraph className="!text-text-secondary !text-[16px] !leading-relaxed">
          <strong>Bəs biz tam olaraq nə edirik?</strong> Dağınıq, mürəkkəb Excel cədvəllərini və anlaşılamayan məlumat yığınlarını təmiz, sadə və baxanda hər kəsin anlaya biləcəyi vizual qrafiklərə çeviririk. Məqsədimiz şirkətlərin satış, maliyyə, əməliyyat və digər mühüm göstəricilərini (KPI) tək bir ekranda cəmləyərək, rəhbərliyin işini yüngülləşdirməkdir.
        </Paragraph>

        <Title level={3} className="!text-text-primary !mt-10 !mb-6 font-display">Bizim Üstünlüklərimiz</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="p-5 h-full bg-base rounded-lg border border-border transition-colors hover:border-az-blue">
              <div className="text-az-blue mb-3"><TrendingUp size={28} /></div>
              <Title level={5} className="!text-text-primary !mb-2">Real Vaxt İzləməsi</Title>
              <Text className="!text-text-secondary">Dashboardlar məlumatların birbaşa olaraq sürətli yenilənməsi ilə işləyir və qərarların gecikməsinin qarşısını alır.</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-5 h-full bg-base rounded-lg border border-border transition-colors hover:border-az-green">
              <div className="text-az-green mb-3"><BarChart3 size={28} /></div>
              <Title level={5} className="!text-text-primary !mb-2">Ağıllı Vizuallaşdırma</Title>
              <Text className="!text-text-secondary">D3.js, Recharts, və digər alətlərlə ən mürəkkəb məlumatların vizual təsviri istifadəçiyə tam aydın olur.</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-5 h-full bg-base rounded-lg border border-border transition-colors hover:border-az-red">
              <div className="text-az-red mb-3"><Users size={28} /></div>
              <Title level={5} className="!text-text-primary !mb-2">Strukturlaşdırılmış UI</Title>
              <Text className="!text-text-secondary">Azərbaycan bayrağı rəngləri və düz (flat) BI interfeysi ilə aydın, funksional panellər.</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
