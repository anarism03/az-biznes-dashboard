export type ThemeMode = 'light' | 'dark'

export type KpiTone = 'blue' | 'green' | 'red' | 'amber' | 'teal' | 'rose' | 'violet'

export interface MacroRow {
  year: string
  period: string
  gdp: number
  nonOilGdp: number
  oilGasGdp: number
  industry: number
  nonOilIndustry: number
  investment: number
  agriculture: number
  transportStorage: number | null
  ictServices: number | null
  retailTrade: number | null
  cargo: number | null
  growth: number
  nonOilGrowth: number
  status: string
  source: string
}

export interface SectorShare {
  sector: string
  share: number
}

export interface WbPoint {
  year: string
  value: number
}

export type WbSeriesKey =
  | 'gdpUsd'
  | 'gdpGrowth'
  | 'gdpPerCapita'
  | 'inflation'
  | 'exports'
  | 'imports'
  | 'fdi'
  | 'unemployment'
  | 'industryShare'
  | 'agriShare'

export type WbDataset = Record<WbSeriesKey, WbPoint[]>

export interface WbValue {
  value: number | null
  /** Dəyərin faktiki aid olduğu il (seçilmiş ildən fərqli ola bilər). */
  year: string | null
}

export interface WbYearSnapshot {
  gdpUsd: WbValue
  gdpGrowth: WbValue
  gdpPerCapita: WbValue
  inflation: WbValue
  exports: WbValue
  imports: WbValue
  fdi: WbValue
  unemployment: WbValue
  industryShare: WbValue
  agriShare: WbValue
}

export interface WbTimePoint {
  year: string
  gdpUsd: number | null
  gdpGrowthPct: number | null
  gdpPerCapita: number | null
  inflation: number | null
  exports: number | null
  imports: number | null
  unemployment: number | null
}


export interface DashboardFilters {
  year: string
  setYear: (year: string) => void
  stepYear: (delta: number) => void
  sector: string
  setSector: (sector: string) => void
  drillSector: string | null
  setDrillSector: (sector: string | null) => void
  /** Sektoru filtr kimi tətbiq edir və detal panelini bir yeniləmədə bağlayır. */
  applySectorFilter: (sector: string) => void
  sectors: SectorShare[]
  selectedMacro: MacroRow
  previousMacro: MacroRow | null
  isPartialYear: boolean
  officialSectorShares: SectorShare[]
  wbData: WbDataset
  wbSource: 'live' | 'cache' | 'snapshot'
  wbLoading: boolean
  wbError: string | null
  fetchedAt: Date | null
  refetchWb: () => void
  wbYear: WbYearSnapshot
  wbTimeSeries: WbTimePoint[]
  clearFilters: () => void
}


export interface KpiCardProps {
  label: string
  value: number | null
  unit?: string
  digits?: number
  /** Əvvəlki ilə nisbətən faiz dəyişməsi; müqayisə mümkün deyilsə null. */
  change?: number | null
  changeLabel?: string
  source?: string
  tone?: KpiTone
  active?: boolean
  onClick?: () => void
  spark?: number[]
  sparkActiveIndex?: number
}

export interface IndicatorBar {
  name: string
  value: number
}

export interface PlatformRow {
  key: string
  tool: string
  focus: string
  exploration: string
  model: string
  ecosystem: string
  deploy: string
  access: string
  criterion: string
}


export interface KpiFrameworkRow {
  key: string
  perspective: string
  kpi: string
  chart: string
  decision: string
}

export interface SourceLink {
  name: string
  detail: string
  url: string
}

export interface ChapterItem {
  title: string
  subtitle: string
  points: string[]
}
