import { CheckCircle2, ChevronRight, ShieldAlert } from 'lucide-react'
import { Panel } from '../../components/ui/ChartCard'
import { PageIntro } from '../../components/ui/PageIntro'
import { governanceLayers } from '../../data/dashboardData'

const rules = [
  'Mənbə sistemi və KPI sahibi sənədləşdirilir.',
  'Hər göstərici üçün düstur və yenilənmə tezliyi ayrıca yazılır.',
  'Boş, təkrar və kənar qiymətlər inteqrasiya mərhələsində yoxlanılır.',
  'Panelda göstəricinin aid olduğu il və son yenilənmə vaxtı görünür.',
  'Seçilmiş il üçün məlumat yoxdursa, başqa ilin dəyəri səssizcə göstərilmir.',
]

const roles = [
  { title: 'Məlumat sahibi', text: 'Mənbənin doğruluğu və yenilənməsi' },
  { title: 'BI analitik', text: 'Model, vizual kodlaşdırma və test' },
  { title: 'Biznes rəhbəri', text: 'KPI hədəfi və qərar mövzusu' },
  { title: 'İcra komandası', text: 'Tədbir və nəticə üzrə geribildirim' },
]

export function Governance() {
  return (
    <>
      <PageIntro
        kicker="Məlumat idarəetməsi"
        title="Vizual qat məlumat xəttinin son halqasıdır"
        description="Məlumat keyfiyyəti, metrik tərifi və semantik model zəifdirsə, qrafik nə qədər yaxşı görünsə də qərarı səhv istiqamətə apara bilər. Aşağıda göstəricinin mənbədən qərara qədər keçdiyi yol və hər mərhələnin yoxlamaları verilir."
      />

      <Panel title="Mənbədən qərara qədər məlumat xətti" subtitle="Beş mərhələ və hər mərhələnin minimal yoxlamaları">
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {governanceLayers.map((l, i) => (
            <div key={l.layer} className="relative rounded-2xl p-4 flex flex-col gap-2" style={{ background: 'color-mix(in srgb, var(--text-primary) 4%, transparent)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-az-blue">{i + 1}-ci mərhələ</span>
                {i < governanceLayers.length - 1 ? <ChevronRight size={18} className="text-text-muted" /> : null}
              </div>
              <div className="text-[16px] font-bold">{l.layer}</div>
              <p className="text-[13.5px] text-text-secondary leading-relaxed m-0">{l.text}</p>
              <ul className="prose-list mt-auto pt-2">
                {l.checks.map((c) => (
                  <li key={c} style={{ fontSize: 13.5 }}>
                    <CheckCircle2 size={15} />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid-2">
        <Panel title="Məlumat keyfiyyəti qaydaları" subtitle="AzərDash prototipində tətbiq olunanlar daxil">
          <ul className="prose-list">
            {rules.map((r) => (
              <li key={r}>
                <CheckCircle2 size={17} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Rollar və məsuliyyət" subtitle="Analitika layihəsində vəzifə bölgüsü">
          <div className="grid gap-3">
            {roles.map((r) => (
              <div key={r.title} className="flex items-center justify-between gap-3 rounded-2xl p-3" style={{ background: 'color-mix(in srgb, var(--text-primary) 4%, transparent)' }}>
                <strong className="text-[15px]">{r.title}</strong>
                <span className="text-[13.5px] text-text-secondary text-right">{r.text}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="note">
        <ShieldAlert size={18} />
        <span>
          <strong>“Zibil giriş — zibil çıxış”.</strong> Gözəl, lakin səhv məlumatlı panel səhv cədvəldən daha təhlükəlidir, çünki vizual forma
          rəqəmə əlavə inam yaradır. Buna görə məlumatın doğruluq və tamlıq yoxlaması paneldən əvvəl gəlir.
        </span>
      </div>
    </>
  )
}
