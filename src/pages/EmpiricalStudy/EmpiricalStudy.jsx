import { useState } from 'react'
import { motion } from 'motion/react'
import { Info, Users } from 'lucide-react'
import { LiquidGlass } from '../../components/glass/LiquidGlass'
import { Panel } from '../../components/ui/ChartCard'
import { PageIntro } from '../../components/ui/PageIntro'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import {
  SURVEY_DATE,
  barriers,
  crossTab,
  decisionUse,
  financialSaving,
  likertRows,
  pct,
  prototypeRating,
  reportTime,
  sectorFrequentUse,
  surveyExperience,
  surveyRoles,
  surveySample,
  surveySectors,
  trainingNeed,
  usageFrequency,
} from '../../data/survey'
import { azNumber } from '../../utils/formatters'

const N = surveySample.eligible
const spring = { type: 'spring', bounce: 0.2, visualDuration: 0.38 }

/** Üfüqi sütunlar: say və faiz yan-yana, məxrəc açıq yazılır. */
function Bars({ items, base = N, color = 'var(--az-blue)', highlight, max }) {
  const top = max ?? Math.max(...items.map((i) => i.count))
  return (
    <div className="grid gap-3">
      {items.map((item, idx) => {
        const isHi = highlight?.includes(item.label)
        return (
          <div key={item.label} className="grid gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-[14px]">
              <span className={isHi ? 'font-bold' : 'text-text-secondary font-medium'}>{item.label}</span>
              <span className="num whitespace-nowrap">
                <strong>{item.count}</strong>
                <span className="text-text-muted"> · {azNumber(pct(item.count, base), 1)}%</span>
              </span>
            </div>
            <div className="sector-row__track" style={{ height: 10 }}>
              <span
                style={{
                  width: `${(item.count / top) * 100}%`,
                  background: isHi || !highlight ? color : `color-mix(in srgb, ${color} 35%, transparent)`,
                  animationDelay: `${idx * 0.05}s`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Stat({ label, value, digits = 0, suffix, note, tone = 'var(--text-primary)' }) {
  return (
    <LiquidGlass className="kpi">
      <span className="kpi__label">{label}</span>
      <div className="kpi__value">
        <strong style={{ color: tone }}>
          <AnimatedNumber value={value} digits={digits} />
        </strong>
        {suffix ? <span>{suffix}</span> : null}
      </div>
      <div className="kpi__foot">{note}</div>
    </LiquidGlass>
  )
}

const DECISION_COLORS = ['var(--az-blue)', 'color-mix(in srgb, var(--az-blue) 45%, transparent)', 'var(--az-red)', 'var(--slate)']

export function EmpiricalStudy() {
  const [profile, setProfile] = useState('sector')
  const profiles = {
    sector: { label: 'Sektor', items: surveySectors },
    role: { label: 'Fəaliyyət sahəsi', items: surveyRoles },
    experience: { label: 'İş təcrübəsi', items: surveyExperience },
  }
  const frequent = usageFrequency[0].count + usageFrequency[1].count
  const regular = decisionUse[0].count
  const regularAmongFrequent = crossTab.rows[0].values[0]

  return (
    <>
      <PageIntro
        kicker={`Anonim sorğu · ${SURVEY_DATE}`}
        title="Dashboarddan tez-tez istifadə hələ qərar hazırlığı demək deyil"
        description={`Azərbaycanda fəaliyyət göstərən müəssisələrin əməkdaşları arasında keçirilmiş sorğunun ${surveySample.total} cavabından ${N}-u uyğunluq meyarına cavab verib. Nəticələr təsviridir: seçmə qeyri-ehtimalidir və ölkə üzrə təmsilçilik və ya səbəbiyyət iddia edilmir.`}
      />

      <div className="grid-kpi">
        <Stat label="Uyğun cavablar" value={N} suffix={`/ ${surveySample.total}`} note={`${surveySample.excluded} cavab Azərbaycanda işləmə meyarına görə çıxarılıb`} />
        <Stat
          label="Gündəlik və ya həftəlik istifadə"
          value={pct(frequent, N)}
          digits={1}
          suffix="%"
          tone="var(--az-blue)"
          note={`${frequent} iştirakçı · məxrəc ${N}`}
        />
        <Stat
          label="Qərar hazırlığında müntəzəm istifadə"
          value={pct(regular, N)}
          digits={1}
          suffix="%"
          tone="var(--az-green)"
          note={`${regular} iştirakçı · məxrəc ${N}`}
        />
        <Stat
          label="Hesabat vaxtının azaldığını bildirən"
          value={pct(reportTime[0].count, N)}
          digits={1}
          suffix="%"
          tone="var(--amber)"
          note={`${reportTime[0].count} iştirakçı · subyektiv qiymətləndirmə`}
        />
      </div>

      {/* ───────── Əsas tapıntı: çarpaz bölgü ───────── */}
      <Panel
        title="İstifadə tezliyi və qərar hazırlığında istifadə"
        subtitle="Eyni iştirakçıların iki sualdakı cavabları birləşdirilib (çarpaz bölgü, n = 29)"
        extra={<span className="chip chip--blue">Əsas tapıntı</span>}
        footer="Statistik hipotez sınağı aparılmayıb; nəticə təsviri müşahidədir."
      >
        <div className="grid-2-1" style={{ alignItems: 'center' }}>
          <div className="grid gap-6">
            {crossTab.rows.map((row) => {
              const total = row.values.reduce((a, b) => a + b, 0)
              return (
                <div key={row.label}>
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <span className="text-[15px] font-bold">{row.label}</span>
                    <span className="text-[14px] text-text-secondary num">{total} nəfər</span>
                  </div>
                  <div className="flex h-12 rounded-[14px] overflow-hidden" role="img" aria-label={row.label}>
                    {row.values.map((v, i) =>
                      v ? (
                        <motion.div
                          key={i}
                          initial={{ flexGrow: 0 }}
                          animate={{ flexGrow: v }}
                          transition={{ ...spring, delay: 0.1 + i * 0.06 }}
                          className="grid place-items-center text-[14px] font-bold num"
                          style={{
                            flexBasis: 0,
                            background: DECISION_COLORS[i],
                            color: i === 1 ? 'var(--text-primary)' : '#fff',
                            borderRight: '2px solid var(--bg-card)',
                          }}
                          title={`${crossTab.columns[i]}: ${v}`}
                        >
                          {v}
                        </motion.div>
                      ) : null,
                    )}
                  </div>
                </div>
              )
            })}
            <div className="legend">
              {crossTab.columns.map((c, i) => (
                <span key={c}>
                  <i style={{ background: DECISION_COLORS[i] }} />
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div>
              <div className="stat-big num" style={{ color: 'var(--az-blue)' }}>
                {regularAmongFrequent} / {frequent}
              </div>
              <p className="text-[15px] leading-relaxed text-text-secondary mt-2 mb-0">
                Dashboarddan gündəlik və ya həftədə bir neçə dəfə istifadə edən {frequent} iştirakçıdan yalnız{' '}
                <strong className="text-text-primary">{regularAmongFrequent}-si ({azNumber(pct(regularAmongFrequent, frequent), 1)}%)</strong>{' '}
                qərar hazırlığında panelə müntəzəm müraciət etdiyini bildirib; {crossTab.rows[0].values[1]} nəfər “bəzən” cavabını
                verib.
              </p>
            </div>
            <div className="note note--blue">
              <Info size={18} />
              <span>Panelə baxış tezliyi ilə qərar prosesinə inteqrasiyanı ayrı göstəricilər kimi izləmək lazımdır.</span>
            </div>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dashboarddan istifadə</th>
                {crossTab.columns.map((c) => (
                  <th key={c} className="is-num">
                    {c}
                  </th>
                ))}
                <th className="is-num">Cəmi</th>
              </tr>
            </thead>
            <tbody>
              {crossTab.rows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="is-num">
                      {v}
                    </td>
                  ))}
                  <td className="is-num font-bold">{row.values.reduce((a, b) => a + b, 0)}</td>
                </tr>
              ))}
              <tr>
                <td className="font-bold">Cəmi</td>
                {decisionUse.map((d) => (
                  <td key={d.label} className="is-num font-bold">
                    {d.count}
                  </td>
                ))}
                <td className="is-num font-bold">{N}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid-2">
        <Panel title="Dashboarddan istifadə tezliyi" subtitle={`Məxrəc ${N}`}>
          <Bars items={usageFrequency} highlight={['Hər gün', 'Həftədə bir neçə dəfə']} />
        </Panel>
        <Panel title="Qərar hazırlığında istifadə" subtitle={`Məxrəc ${N}`}>
          <Bars items={decisionUse} color="var(--az-green)" highlight={['Müntəzəm']} />
          <p className="text-[13.5px] text-text-secondary mt-4 mb-0">
            Müntəzəm və ya bəzən istifadəni birlikdə {decisionUse[0].count + decisionUse[1].count} nəfər (
            {azNumber(pct(decisionUse[0].count + decisionUse[1].count, N), 1)}%) bildirib.
          </p>
        </Panel>
      </div>

      {/* ───────── Likert: divergent sütunlar ───────── */}
      <Panel
        title="Dashboardun faydasına dair ifadələr"
        subtitle="Beşpilləli şkala: 4–5 müsbət, 3 neytral, 1–2 mənfi · hər sətirdə n = 29"
        footer="Psixometrik cəhətdən təsdiqlənmiş vahid şkala və ümumi effektivlik balı qurulmayıb; hər ifadənin bölgüsü ayrıca göstərilir."
      >
        <div className="grid gap-4">
          {likertRows.map((row, ri) => (
            <div key={row.statement} className="grid gap-2" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
              <div className="flex items-baseline justify-between gap-3 text-[14.5px]">
                <span className="font-semibold">{row.statement}</span>
                <span className="num text-az-green font-bold whitespace-nowrap">{azNumber(pct(row.positive, N), 1)}%</span>
              </div>
              <div className="flex h-9 rounded-xl overflow-hidden" role="img" aria-label={row.statement}>
                {[
                  { v: row.negative, c: 'var(--az-red)', l: 'Mənfi' },
                  { v: row.neutral, c: 'color-mix(in srgb, var(--slate) 35%, transparent)', l: 'Neytral' },
                  { v: row.positive, c: 'var(--az-green)', l: 'Müsbət' },
                ].map((seg, i) =>
                  seg.v ? (
                    <motion.div
                      key={seg.l}
                      initial={{ flexGrow: 0 }}
                      animate={{ flexGrow: seg.v }}
                      transition={{ ...spring, delay: ri * 0.05 + i * 0.04 }}
                      className="grid place-items-center text-[13px] font-bold num"
                      style={{ flexBasis: 0, background: seg.c, color: i === 1 ? 'var(--text-primary)' : '#fff', borderRight: '2px solid var(--bg-card)' }}
                      title={`${seg.l}: ${seg.v}`}
                    >
                      {seg.v}
                    </motion.div>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="legend mt-4">
          <span>
            <i style={{ background: 'var(--az-red)' }} />
            Mənfi (1–2)
          </span>
          <span>
            <i style={{ background: 'color-mix(in srgb, var(--slate) 35%, transparent)' }} />
            Neytral (3)
          </span>
          <span>
            <i style={{ background: 'var(--az-green)' }} />
            Müsbət (4–5)
          </span>
        </div>
      </Panel>

      <div className="grid-2">
        <Panel
          title="Hesabat hazırlama vaxtına təsir"
          subtitle="Ayrıca retrospektiv sual · məxrəc 29"
          footer="Bu 44,8% “qərar müddətini azaldır” ifadəsindəki 79,3% ilə eyni ölçü deyil: biri şəxsi müşahidədir, digəri ümumi ifadə ilə razılıq."
        >
          <Bars items={reportTime} color="var(--amber)" highlight={['Azalıb']} />
        </Panel>
        <Panel title="Tətbiq maneələri" subtitle="Çoxseçimli sual · faizlər 29-a görə, cəmi 100%-dən çoxdur">
          <Bars items={barriers} color="var(--az-red)" highlight={['Bacarıq çatışmazlığı', 'Xərc']} />
        </Panel>
      </div>

      <div className="grid-3">
        <Panel title="Əlavə təlim ehtiyacı" subtitle="Məxrəc 29">
          <Bars items={trainingNeed} color="var(--az-blue)" highlight={['Bəli']} />
        </Panel>
        <Panel title="Maliyyə qənaəti barədə bəyanat" subtitle="Sənəd təsdiqi yoxlanılmayıb">
          <Bars items={financialSaving} color="var(--slate)" />
        </Panel>
        <Panel title="AzərDash prototipinin faydası" subtitle={`Prototipə baxan ${prototypeRating.viewed} iştirakçı · məxrəc ${prototypeRating.viewed}`}>
          <Bars items={prototypeRating.items} base={prototypeRating.viewed} color="var(--az-green)" highlight={['Faydalı / çox faydalı']} />
        </Panel>
      </div>

      {/* ───────── Nümunənin profili ───────── */}
      <div className="grid-2-1">
        <Panel
          title="İştirakçıların profili"
          subtitle="Sektor və rol tərkibi nəticələrin şərhində nəzərə alınmalıdır"
          extra={
            <div className="flex rounded-full p-1" style={{ background: 'var(--bg-hover)' }} role="tablist">
              {Object.entries(profiles).map(([key, p]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={profile === key}
                  onClick={() => setProfile(key)}
                  className="press relative border-0 bg-transparent rounded-full px-3 h-8 text-[13px] font-semibold cursor-pointer"
                  style={{ color: profile === key ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {profile === key ? (
                    <motion.span layoutId="profile-tab" transition={spring} className="absolute inset-0 rounded-full" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }} />
                  ) : null}
                  <span className="relative">{p.label}</span>
                </button>
              ))}
            </div>
          }
        >
          <Bars key={profile} items={profiles[profile].items} color="var(--az-blue)" />
        </Panel>

        <Panel title="Sektor üzrə tez-tez istifadə" subtitle="Gündəlik və ya həftədə bir neçə dəfə" footer="Altqruplar kiçikdir; cədvəl sektorlar üçün reytinq deyil.">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sektor</th>
                <th className="is-num">n</th>
                <th className="is-num">Tez-tez</th>
                <th className="is-num">%</th>
              </tr>
            </thead>
            <tbody>
              {sectorFrequentUse.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td className="is-num">{row.n}</td>
                  <td className="is-num">{row.frequent}</td>
                  <td className="is-num">{azNumber(pct(row.frequent, row.n), 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="note">
        <Users size={18} />
        <span>
          <strong>Metodoloji qeyd.</strong> Kəsik tipli, bir gündə toplanmış anonim onlayn sorğu (Google Forms, 20 sual).
          İştirakçılar əlçatanlıq əsasında cəlb olunub; cavabvermə faizi hesablanmır. Nəticələr dissertasiyanın III fəslində və
          “İnnovasionnaya nauka” jurnalında (№ 11-2-1/2026, s. 41–47) dərc olunmuş məqalədə ətraflı şərh edilir.
        </span>
      </div>
    </>
  )
}
