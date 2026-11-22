import type {
  ChapterItem,
  KpiFrameworkRow,
  MacroRow,
  PlatformRow,
  SectorShare,
  SourceLink,
} from '../types/dashboard'

export const years = ['2021', '2022', '2023', '2024', '2025', '2026'] as const

export const sectors = [
  'Hamısı',
  'Sənaye',
  'Ticarət və nəqliyyat vasitələrinin təmiri',
  'Nəqliyyat və anbar təsərrüfatı',
  'Tikinti',
  'Kənd təsərrüfatı',
  'Turistlərin yerləşdirilməsi və ictimai iaşə',
  'İnformasiya və rabitə',
  'Digər sahələr',
]

export const annualOfficialMacro: MacroRow[] = [
  {
    year: '2021',
    period: 'Yanvar-dekabr 2021',
    gdp: 92857.7,
    nonOilGdp: 57786.2,
    oilGasGdp: 35071.5,
    industry: 54480.5,
    nonOilIndustry: 15457.2,
    investment: 16127.0,
    agriculture: 9163.4,
    transportStorage: null,
    ictServices: null,
    retailTrade: null,
    cargo: 193.9,
    growth: 5.6,
    nonOilGrowth: 7.2,
    status: 'Tam il',
    source: 'Dövlət Statistika Komitəsi, yanvar-dekabr 2021',
  },
  {
    year: '2022',
    period: 'Yanvar-dekabr 2022',
    gdp: 133825.8,
    nonOilGdp: 69826.0,
    oilGasGdp: 63999.8,
    industry: 86002.7,
    nonOilIndustry: 17576.4,
    investment: 18272.3,
    agriculture: 10984.2,
    transportStorage: null,
    ictServices: null,
    retailTrade: null,
    cargo: 218.7,
    growth: 4.6,
    nonOilGrowth: 9.1,
    status: 'Tam il',
    source: 'Dövlət Statistika Komitəsi, yanvar-dekabr 2022',
  },
  {
    year: '2023',
    period: 'Yanvar-dekabr 2023',
    gdp: 123005.5,
    nonOilGdp: 77661.8,
    oilGasGdp: 45343.7,
    industry: 66619.0,
    nonOilIndustry: 17741.7,
    investment: 20296.6,
    agriculture: 12210.6,
    transportStorage: null,
    ictServices: null,
    retailTrade: null,
    cargo: 230.2,
    growth: 1.1,
    nonOilGrowth: 3.7,
    status: 'Tam il',
    source: 'Dövlət Statistika Komitəsi, yanvar-dekabr 2023',
  },
  {
    year: '2024',
    period: 'Yanvar-dekabr 2024',
    gdp: 126337.0,
    nonOilGdp: 85712.4,
    oilGasGdp: 40624.6,
    industry: 64059.8,
    nonOilIndustry: 18778.2,
    investment: 21435.1,
    agriculture: 12995.2,
    transportStorage: null,
    ictServices: null,
    retailTrade: 62200.0,
    cargo: 238.8,
    growth: 4.1,
    nonOilGrowth: 6.2,
    status: 'Tam il',
    source: 'Dövlət Statistika Komitəsi, yanvar-dekabr 2024',
  },
  {
    year: '2025',
    period: 'Yanvar-dekabr 2025',
    gdp: 129094.0,
    nonOilGdp: 92307.1,
    oilGasGdp: 36786.9,
    industry: 63123.4,
    nonOilIndustry: 20955.5,
    investment: 21226.1,
    agriculture: 14189.5,
    transportStorage: null,
    ictServices: null,
    retailTrade: null,
    cargo: 243.2,
    growth: 1.4,
    nonOilGrowth: 2.7,
    status: 'Tam il',
    source: 'Dövlət Statistika Komitəsi, yanvar-dekabr 2025',
  },
  {
    year: '2026',
    period: 'Yanvar-aprel 2026',
    gdp: 39875.1,
    nonOilGdp: 27740.1,
    oilGasGdp: 12135.0,
    industry: 21120.4,
    nonOilIndustry: 7092.2,
    investment: 5275.0,
    agriculture: 2536.9,
    transportStorage: 4748.6,
    ictServices: 1271.2,
    retailTrade: 20102.8,
    cargo: null,
    growth: 0.2,
    nonOilGrowth: 0.7,
    status: 'Cari dövr',
    source: 'Dövlət Statistika Komitəsi, yanvar-aprel 2026',
  },
]

export const officialSectorSharesByYear: Record<string, SectorShare[]> = {
  2024: [
    { sector: 'Sənaye', share: 35.9 },
    { sector: 'Ticarət və nəqliyyat vasitələrinin təmiri', share: 10.7 },
    { sector: 'Nəqliyyat və anbar təsərrüfatı', share: 7.0 },
    { sector: 'Tikinti', share: 6.7 },
    { sector: 'Kənd təsərrüfatı', share: 5.7 },
    { sector: 'Turistlərin yerləşdirilməsi və ictimai iaşə', share: 2.4 },
    { sector: 'İnformasiya və rabitə', share: 1.9 },
    { sector: 'Digər sahələr', share: 19.9 },
    { sector: 'Məhsula və idxala xalis vergilər', share: 9.8 },
  ],
  2025: [
    { sector: 'Sənaye', share: 33.0 },
    { sector: 'Ticarət və nəqliyyat vasitələrinin təmiri', share: 11.3 },
    { sector: 'Nəqliyyat və anbar təsərrüfatı', share: 7.1 },
    { sector: 'Tikinti', share: 6.5 },
    { sector: 'Kənd təsərrüfatı', share: 5.9 },
    { sector: 'Turistlərin yerləşdirilməsi və ictimai iaşə', share: 2.8 },
    { sector: 'İnformasiya və rabitə', share: 2.1 },
    { sector: 'Digər sahələr', share: 21.7 },
    { sector: 'Məhsula və idxala xalis vergilər', share: 9.6 },
  ],
  2026: [
    { sector: 'Sənaye', share: 35.7 },
    { sector: 'Ticarət və nəqliyyat vasitələrinin təmiri', share: 10.6 },
    { sector: 'Nəqliyyat və anbar təsərrüfatı', share: 7.3 },
    { sector: 'Tikinti', share: 4.9 },
    { sector: 'Kənd təsərrüfatı', share: 3.5 },
    { sector: 'Turistlərin yerləşdirilməsi və ictimai iaşə', share: 3.0 },
    { sector: 'İnformasiya və rabitə', share: 2.1 },
    { sector: 'Digər sahələr', share: 22.8 },
    { sector: 'Məhsula və idxala xalis vergilər', share: 10.1 },
  ],
}

/**
 * Platformaların keyfiyyət müqayisəsi (dissertasiya, Cədvəl 6).
 * Rəqəmsal bal və reytinq hesablanmır: çəkilər konkret müəssisənin tələbindən asılıdır.
 */
export const platformComparison: PlatformRow[] = [
  {
    key: 'tableau',
    tool: 'Tableau',
    focus: 'Vizual araşdırma',
    exploration: 'İnteraktiv vizuallar və VizQL',
    model: 'Hesablanan sahələr və məlumat modeli',
    ecosystem: 'Tableau platforması və konnektorlar',
    deploy: 'Cloud və Server variantları',
    access: 'Platforma icazələri və paylaşma',
    criterion: 'Tapşırıq və bacarıqla uyğunluq',
  },
  {
    key: 'power-bi',
    tool: 'Power BI',
    focus: 'Model və hesabat inteqrasiyası',
    exploration: 'İnteraktiv hesabat və vizuallar',
    model: 'Model və DAX ölçüləri',
    ecosystem: 'Microsoft xidmətləri ilə inteqrasiya',
    deploy: 'Desktop, xidmət və server variantları',
    access: 'Model və xidmət icazələri',
    criterion: 'Mövcud infrastrukturla uyğunluq',
  },
  {
    key: 'looker',
    tool: 'Looker',
    focus: 'Vahid metrik modeli',
    exploration: 'Explore və modelə əsaslanan baxış',
    model: 'LookML semantik modeli',
    ecosystem: 'Google Cloud və verilənlər bazası modeli',
    deploy: 'İdarə olunan Looker variantları',
    access: 'Model və platforma icazələri',
    criterion: 'Metrik idarəetməsi tələbləri',
  },
  {
    key: 'd3',
    tool: 'D3.js',
    focus: 'Tam vizual nəzarət',
    exploration: 'SVG/Canvas ilə xüsusi qrafiklər',
    model: 'Model tətbiq kodunda qurulur',
    ecosystem: 'Açıq mənbə, veb standartları',
    deploy: 'İstənilən veb tətbiqə daxil edilir',
    access: 'Tətbiqin öz giriş qaydaları',
    criterion: 'Mühəndislik resursu',
  },
  {
    key: 'vega-lite',
    tool: 'Vega-Lite',
    focus: 'Deklarativ spesifikasiya',
    exploration: 'Qrammatika əsaslı interaktiv qrafiklər',
    model: 'JSON spesifikasiyası',
    ecosystem: 'Açıq mənbə, Vega ekosistemi',
    deploy: 'Veb, notebook və hesabatlar',
    access: 'Tətbiqin öz giriş qaydaları',
    criterion: 'Prototip sürəti',
  },
]

export const platformCriteria: { key: keyof PlatformRow; label: string }[] = [
  { key: 'exploration', label: 'Vizual araşdırma' },
  { key: 'model', label: 'Metrik modeli' },
  { key: 'ecosystem', label: 'Ekosistem' },
  { key: 'deploy', label: 'Yerləşdirmə' },
  { key: 'access', label: 'Giriş və idarəetmə' },
  { key: 'criterion', label: 'Yerli seçim meyarı' },
]

/** Çoxmeyarlı seçim metodologiyasının addımları (dissertasiya, 2.1). */
export const selectionSteps = [
  'İstifadəçi profillərini müəyyən edin',
  'Kritik qərar ssenarilərini yazın',
  'Məlumat mənbələrini inventarizasiya edin',
  'Meyar çəkilərini biznes rəhbərləri ilə razılaşdırın',
  'Qısa siyahını kiçik pilotda sınayın',
  'Ümumi sahibolma xərcini və riskləri hesablayın',
  'İdarəetmə modelini seçimlə birlikdə təsdiqləyin',
]

export const kpiRows: KpiFrameworkRow[] = [
  {
    key: 'financial',
    perspective: 'Maliyyə',
    kpi: 'Gəlir artımı, EBITDA marjası, xərc-gəlir nisbəti',
    chart: 'Xətt qrafiki, şəlalə qrafiki, fərq sütunları',
    decision: 'Büdcə bölgüsü və rentabellik qərarları',
  },
  {
    key: 'customer',
    perspective: 'Müştəri',
    kpi: 'NPS, aktiv müştəri, təkrar alış, müştəri itkisi',
    chart: 'Kohort cədvəli, istilik xəritəsi, huni',
    decision: 'Seqmentləşdirmə və xidmət keyfiyyəti',
  },
  {
    key: 'process',
    perspective: 'Daxili proses',
    kpi: 'SLA, dövriyyə müddəti, əməliyyat xətası',
    chart: 'Qutu diaqramı, nəzarət qrafiki, axın diaqramı',
    decision: 'Proses optimallaşdırması və risk azaldılması',
  },
  {
    key: 'learning',
    perspective: 'Öyrənmə və inkişaf',
    kpi: 'Rəqəmsal bacarıq səviyyəsi, təlim saatı, innovasiya payı',
    chart: 'Radar, göstərici kartı, trend',
    decision: 'İnsan kapitalı və analitika mədəniyyəti',
  },
]

/** Məlumat xəttinin qatları (dissertasiya, Şəkil 4). Faiz və “hazırlıq balı” göstərilmir. */
export const governanceLayers = [
  {
    layer: 'Mənbə sistemləri',
    text: 'ERP, CRM, POS, dövlət açıq məlumatları və sorğu cavabları',
    checks: ['Mənbə sahibi təyin edilib', 'Yenilənmə tezliyi yazılıb'],
  },
  {
    layer: 'İnteqrasiya və anbar',
    text: 'Təmizləmə, normallaşdırma, keyfiyyət testləri və tarixçə',
    checks: ['Boş və təkrar qeydlər yoxlanılır', 'Kənarlaşmalar qeyd olunur'],
  },
  {
    layer: 'Semantik qat',
    text: 'KPI lüğəti, metrik sahibi və razılaşdırılmış biznes anlayışları',
    checks: ['Hər göstəricinin düsturu var', 'Ölçü vahidi və dövr göstərilir'],
  },
  {
    layer: 'Vizual qat',
    text: 'Panel, detal baxışı, filtr, xəbərdarlıq və mobil görünüş',
    checks: ['Mənbə ili kartda görünür', 'Qismən il ayrıca işarələnir'],
  },
  {
    layer: 'Qərar dövrü',
    text: 'Tövsiyə, icra sahibi, nəticənin ölçülməsi və geribildirim',
    checks: ['Qərar sahibi bəllidir', 'Nəticə göstəricisi seçilib'],
  },
]

export const chapterMap: ChapterItem[] = [
  {
    title: 'I fəsil',
    subtitle: 'Nəzəri-metodoloji əsaslar',
    points: [
      'Data vizuallaşdırmanın konseptual əsasları və təsnifatı',
      'İnteraktiv dashboardun inkişafı, növləri və tendensiyalar',
      'Ənənəvi hesabat ilə vizual analitikanın müqayisəsi',
    ],
  },
  {
    title: 'II fəsil',
    subtitle: 'Alətlərin tətbiqi və AzərDash',
    points: [
      'Tableau, Power BI və Looker-in funksional müqayisəsi',
      'KPI çərçivəsinin dashboard arxitekturasına inteqrasiyası',
      'D3.js, Vega-Lite və beynəlxalq İKT müqayisəsi',
    ],
  },
  {
    title: 'III fəsil',
    subtitle: 'Empirik tədqiqat',
    points: [
      '26.10.2026 sorğusunun dizaynı (32 cavab, 29 uyğun)',
      'İstifadə tezliyi ilə qərar hazırlığının çarpaz təhlili',
      'Tətbiq maneələri və 90 günlük pilot yol xəritəsi',
    ],
  },
]

export const recommendations = [
  'Müəssisədə vahid KPI kataloqu və semantik qat yaradılsın; hər göstəricinin düsturu, mənbəyi və sahibi yazılsın.',
  'Dashboard layihəsi texniki quraşdırma kimi deyil, idarəetmə dəyişikliyi kimi planlaşdırılsın.',
  'Panelə baxış tezliyi ilə qərar hazırlığında istifadə ayrıca ölçülsün: sorğuda 18 tez-tez istifadəçidən yalnız 7-si müntəzəm qərar istifadəsi bildirib.',
  'Təlim konkret iş tapşırıqları (filtr, göstəricinin izahı, müqayisənin yoxlanılması) üzrə qurulsun.',
  'Yeni panel 90 günlük pilotla, əvvəlcədən seçilmiş uğur meyarları ilə sınansın.',
  'Vizual nəticə qərara çevrilməzdən əvvəl mənbə və dövr baxımından yoxlansın.',
]

export const sourceLinks: SourceLink[] = [
  {
    name: 'Dövlət Statistika Komitəsi, 2024',
    detail: '2024-cü ildə ÜDM 126,3 mlrd manat, real artım 4,1%, qeyri-neft/qaz artımı 6,2%.',
    url: 'https://stat.gov.az/news/index.php?id=6156&lang=en',
  },
  {
    name: 'Dövlət Statistika Komitəsi, 2025',
    detail: '2025-ci ildə ÜDM 129,1 mlrd manat, real artım 1,4%, qeyri-neft/qaz artımı 2,7%.',
    url: 'https://www.stat.gov.az/news/index.php?id=6590&lang=en',
  },
  {
    name: 'Dövlət Statistika Komitəsi, 2026',
    detail: '2026-cı ilin yanvar–aprel dövründə ÜDM 39,9 mlrd manat, real artım 0,2%. Tam il deyil.',
    url: 'https://www.stat.gov.az/news/index.php?id=6703&lang=en',
  },
  {
    name: 'Dünya Bankı Open Data',
    detail: 'ÜDM (USD), real artım, inflyasiya, işsizlik, ixrac, idxal və sektor payları; api.worldbank.org/v2.',
    url: 'https://data.worldbank.org/country/azerbaijan',
  },
  {
    name: 'İqtisadiyyat Nazirliyi',
    detail: 'Rəqəmsal iqtisadiyyatın inkişafına dair 2026–2029-cu illər üçün Strategiya.',
    url: 'https://www.economy.gov.az/en/page/ganunvericilik/strategiyalar',
  },
  {
    name: 'İnnovasionnaya nauka, № 11-2-1/2026',
    detail: 'Sardarova I., Ismayılzada A. Dashboard istifadəsi və qərar hazırlığının təsviri təhlili, s. 41–47.',
    url: 'https://aeterna-ufa.ru',
  },
]
