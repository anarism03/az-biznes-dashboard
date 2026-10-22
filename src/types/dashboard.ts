export type ThemeMode = 'light' | 'dark'

export type KpiTone = 'teal' | 'blue' | 'amber' | 'rose' | 'violet'

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

export interface WbYearSnapshot {
  gdpUsd: number | null
  gdpGrowth: number | null
  gdpPerCapita: number | null
  inflation: number | null
  exports: number | null
  imports: number | null
  fdi: number | null
  unemployment: number | null
  industryShare: number | null
  agriShare: number | null
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

export interface FilterTotals {
  revenue: number
  expense: number
  profit: number
  margin: number
}

export interface DashboardFilters {
  year: string
  setYear: (year: string) => void
  sector: string
  setSector: (sector: string) => void
  drillSector: string | null
  setDrillSector: (sector: string | null) => void
  sectors: SectorShare[]
  totals: FilterTotals
  selectedMacro: MacroRow
  previousMacro: MacroRow | null
  officialSectorShares: SectorShare[]
  wbData: WbDataset | null
  wbLoading: boolean
  wbError: string | null
  fetchedAt: Date | null
  wbYear: WbYearSnapshot | null
  wbTimeSeries: WbTimePoint[]
  clearFilters: () => void
}

export interface KpiCardProps {
  label: string
  value: number
  unit?: string
  change?: number
  changeText?: string
  source?: string
  tone?: KpiTone
  active?: boolean
  onClick?: () => void
  loading?: boolean
}

export interface IndicatorBar {
  name: string
  value: number
}

export interface PlatformRow {
  key: string
  tool: string
  governance: number
  modeling: number
  integration: number
  cost: number
  custom: number
  bestFor: string
}

export interface EmpiricalRow {
  metric: string
  before: number
  after: number
  delta: number
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
