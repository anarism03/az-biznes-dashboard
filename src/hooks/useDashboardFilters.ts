import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { annualOfficialMacro, officialSectorSharesByYear, sectors as sectorOptions, years } from '../data/dashboardData'
import { useWorldBankData } from './useWorldBankData'
import { getPointUpTo, getValueForYear } from '../services/worldBankApi'
import type { DashboardFilters, MacroRow, WbSeriesKey, WbTimePoint, WbYearSnapshot } from '../types/dashboard'

export const DEFAULT_YEAR = '2025'
export const DEFAULT_SECTOR = 'Hamısı'

const WB_KEYS: WbSeriesKey[] = [
  'gdpUsd',
  'gdpGrowth',
  'gdpPerCapita',
  'inflation',
  'exports',
  'imports',
  'fdi',
  'unemployment',
  'industryShare',
  'agriShare',
]

/**
 * Filtrlər URL-də saxlanılır (?il=2025&sektor=Sənaye) — panelin vəziyyəti linklə paylaşıla bilir.
 */
export function useDashboardFilters(): DashboardFilters {
  const [params, setParams] = useSearchParams()

  const rawYear = params.get('il')
  const year = rawYear && (years as readonly string[]).includes(rawYear) ? rawYear : DEFAULT_YEAR
  const rawSector = params.get('sektor')
  const sector = rawSector && sectorOptions.includes(rawSector) ? rawSector : DEFAULT_SECTOR
  const drillSector = params.get('detal')

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(patch).forEach(([key, value]) => {
            if (value === null) next.delete(key)
            else next.set(key, value)
          })
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setParams],
  )

  const setYear = useCallback((next: string) => update({ il: next === DEFAULT_YEAR ? null : next }), [update])
  const setSector = useCallback(
    (next: string) => update({ sektor: next === DEFAULT_SECTOR ? null : next }),
    [update],
  )
  const setDrillSector = useCallback((next: string | null) => update({ detal: next }), [update])
  const applySectorFilter = useCallback(
    (next: string) => update({ sektor: next === DEFAULT_SECTOR ? null : next, detal: null }),
    [update],
  )
  const stepYear = useCallback(
    (delta: number) => {
      const idx = years.indexOf(year as (typeof years)[number])
      const next = years[Math.min(years.length - 1, Math.max(0, idx + delta))]
      setYear(next)
    },
    [year, setYear],
  )

  const { wbData, wbSource, wbLoading, wbError, fetchedAt, refetch } = useWorldBankData()

  const selectedMacro = useMemo<MacroRow>(
    () => annualOfficialMacro.find((item) => item.year === year) ?? annualOfficialMacro[annualOfficialMacro.length - 2],
    [year],
  )

  const previousMacro = useMemo<MacroRow | null>(() => {
    const idx = annualOfficialMacro.findIndex((item) => item.year === selectedMacro.year)
    const prev = idx > 0 ? annualOfficialMacro[idx - 1] : null
    // Qismən il (yanvar–aprel) tam illə müqayisə edilmir
    if (!prev || prev.status !== selectedMacro.status) return null
    return prev
  }, [selectedMacro])

  const wbYear = useMemo<WbYearSnapshot>(() => {
    const snapshot = {} as WbYearSnapshot
    WB_KEYS.forEach((key) => {
      const point = getPointUpTo(wbData[key], year)
      snapshot[key] = { value: point?.value ?? null, year: point?.year ?? null }
    })
    return snapshot
  }, [wbData, year])

  const wbTimeSeries = useMemo<WbTimePoint[]>(() => {
    const allYears = [...new Set([...(wbData.gdpUsd || []).map((d) => d.year)])]
      .filter((y) => Number(y) >= 2015)
      .sort()
    return allYears.map((y) => ({
      year: y,
      gdpUsd: getValueForYear(wbData.gdpUsd, y),
      gdpGrowthPct: getValueForYear(wbData.gdpGrowth, y),
      gdpPerCapita: getValueForYear(wbData.gdpPerCapita, y),
      inflation: getValueForYear(wbData.inflation, y),
      exports: getValueForYear(wbData.exports, y),
      imports: getValueForYear(wbData.imports, y),
      unemployment: getValueForYear(wbData.unemployment, y),
    }))
  }, [wbData])

  const officialSectorShares = officialSectorSharesByYear[year] || []
  const sectors = useMemo(() => {
    if (sector === DEFAULT_SECTOR) return officialSectorShares
    return officialSectorShares.filter((item) => item.sector === sector)
  }, [sector, officialSectorShares])

  const clearFilters = useCallback(() => update({ il: null, sektor: null, detal: null }), [update])

  return {
    year,
    setYear,
    stepYear,
    sector,
    setSector,
    drillSector,
    setDrillSector,
    applySectorFilter,
    sectors,
    selectedMacro,
    previousMacro,
    isPartialYear: selectedMacro.status !== 'Tam il',
    officialSectorShares,
    wbData,
    wbSource,
    wbLoading,
    wbError,
    fetchedAt,
    refetchWb: refetch,
    wbYear,
    wbTimeSeries,
    clearFilters,
  }
}
