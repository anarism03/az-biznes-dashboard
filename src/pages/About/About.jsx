import { Code2, GraduationCap, Keyboard, Layers3, MousePointerClick, ShieldCheck } from 'lucide-react'
import { BrandLogo } from '../../components/brand/BrandLogo'
import { LiquidGlass } from '../../components/glass/LiquidGlass'
import { Panel } from '../../components/ui/ChartCard'

const features = [
  { icon: MousePointerClick, title: 'Əlaqəli filtrlər', text: 'İl zolağı, qrafikə klik və sektor seçimi bütün paneli birlikdə yeniləyir; vəziyyət URL-də saxlanılır və linklə paylaşılır.' },
  { icon: ShieldCheck, title: 'Şəffaf mənbə', text: 'Hər kartda məlumatın aid olduğu il yazılır; qismən il (2026) tam illik trendə qoşulmur.' },
  { icon: Layers3, title: 'Real sorğu məlumatı', text: '26.10.2026 sorğusunun 29 uyğun cavabı: çarpaz bölgü, fayda ifadələri, maneələr.' },
  { icon: Keyboard, title: 'Klaviatura ilə idarə', text: 'Komanda paleti (Ctrl/⌘ + K), il keçidi (← →), tema (T), təqdimat rejimi (F), çap (P).' },
]

const stack = ['React 18', 'TypeScript', 'Vite', 'Recharts', 'Motion', 'Ant Design', 'Tailwind CSS', 'View Transitions API', 'Dünya Bankı Open Data API']

export function About() {
  return (
    <>
      <LiquidGlass as="section" className="page-intro">
        <div className="flex items-center gap-5 min-w-0">
          <BrandLogo size={72} />
          <div className="min-w-0">
            <div className="page-intro__kicker">Layihə haqqında</div>
            <h2 style={{ marginBottom: 6 }}>AzərDash</h2>
            <p>
              “Biznesdə qərarverməni optimallaşdırmaq üçün qabaqcıl data vizuallaşdırma və interaktiv dashboard analizi” mövzusunda magistr
              dissertasiyasının praktiki prototipi. Panel Dövlət Statistika Komitəsinin rəsmi göstəricilərini, Dünya Bankı Open Data API-sini
              və müəllifin keçirdiyi sorğunun nəticələrini bir interfeysdə birləşdirir.
            </p>
          </div>
        </div>
      </LiquidGlass>

      <div className="grid-kpi">
        {features.map((f) => (
          <LiquidGlass key={f.title} className="kpi">
            <span className="grid place-items-center w-10 h-10 rounded-xl" style={{ background: 'color-mix(in srgb, var(--az-blue) 13%, transparent)', color: 'var(--az-blue)' }}>
              <f.icon size={20} />
            </span>
            <p className="text-[16px] font-bold mt-3 mb-1">{f.title}</p>
            <p className="text-[14px] text-text-secondary leading-relaxed m-0">{f.text}</p>
          </LiquidGlass>
        ))}
      </div>

      <div className="grid-2">
        <Panel title="Müəllif" subtitle="Azərbaycan Dövlət İqtisad Universiteti (UNEC)" extra={<GraduationCap size={20} className="text-az-blue" />}>
          <table className="data-table">
            <tbody>
              <tr>
                <td className="text-text-secondary" style={{ width: 170 }}>Magistrant</td>
                <td className="font-semibold">İsmayılzadə Anar Nizami oğlu</td>
              </tr>
              <tr>
                <td className="text-text-secondary">İxtisas</td>
                <td>7006005 Data elmləri · Verilənlərin təhlili</td>
              </tr>
              <tr>
                <td className="text-text-secondary">Elmi rəhbər</td>
                <td>t.ü.f.d., dos. Sərdarova İcabikə Ziya qızı</td>
              </tr>
              <tr>
                <td className="text-text-secondary">Dərc olunmuş məqalə</td>
                <td>İnnovasionnaya nauka, № 11-2-1/2026, s. 41–47</td>
              </tr>
              <tr>
                <td className="text-text-secondary">Əlaqə</td>
                <td>
                  <a className="text-az-blue no-underline" href="mailto:ismayilzadeanar310@gmail.com">
                    ismayilzadeanar310@gmail.com
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </Panel>
        <Panel title="Texnologiyalar" subtitle="Açıq veb texnologiyaları ilə qurulmuş yüngül prototip" extra={<Code2 size={20} className="text-az-blue" />}>
          <div className="flex flex-wrap gap-2">
            {stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          <p className="text-[14px] text-text-secondary leading-relaxed mt-4 mb-0">
            Mənbə kodu:{' '}
            <a className="text-az-blue no-underline" href="https://github.com/anarism03/az-biznes-dashboard" target="_blank" rel="noreferrer">
              github.com/anarism03/az-biznes-dashboard
            </a>
            . Panel tətbiq olunan dəyişikliklərdən sonra Vercel-də avtomatik yenilənir.
          </p>
        </Panel>
      </div>
    </>
  )
}
