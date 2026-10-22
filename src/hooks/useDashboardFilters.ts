import { useCallback, useMemo, useState } from 'react'
import {
  annualOfficialMacro,
  officialSectorSharesByYear,
} from '../data/dashboardData'
import { useWorldBankData } from './useWorldBankData'
import { getValueForYear } from '../services/worldBankApi'
import type { DashboardFilters, MacroRow, WbTimePoint, WbYearSnapshot } from '../types/dashboard'

const DEFAULT_YEAR = '2025'
const DEFAULT_SECTOR = 'Hamısı'

export function useDashboardFilters(): DashboardFilters {
  const [year, setYear] = useState(DEFAULT_YEAR)
  const [sector, setSector] = useState(DEFAULT_SECTOR)
  const [drillSector, setDrillSector] = useState<string | null>(null)

  const { wbData, wbLoading, wbError, fetchedAt } = useWorldBankData()

  const selectedMacro = useMemo<MacroRow>(
    () => annualOfficialMacro.find((item) => item.year === year) || annualOfficialMacro.at(-1)!,
    [year],
  )

  const previousMacro = useMemo<MacroRow | null>(() => {
    const idx = annualOfficialMacro.findIndex((item) => item.year === selectedMacro.year)
    return idx > 0 ? annualOfficialMacro[idx - 1] : null
  }, [selectedMacro.year])

  const wbYear = useMemo<WbYearSnapshot | null>(() => {
    if (!wbData) return null
    return {
      gdpUsd: getValueForYear(wbData.gdpUsd, year),
      gdpGrowth: getValueForYear(wbData.gdpGrowth, year),
      gdpPerCapita: getValueForYear(wbData.gdpPerCapita, year),
      inflation: getValueForYear(wbData.inflation, year),
      exports: getValueForYear(wbData.exports, year),
      imports: getValueForYear(wbData.imports, year),
      fdi: getValueForYear(wbData.fdi, year),
      unemployment: getValueForYear(wbData.unemployment, year),
      industryShare: getValueForYear(wbData.industryShare, year),
      agriShare: getValueForYear(wbData.agriShare, year),
    }
  }, [wbData, year])

  const wbTimeSeries = useMemo<WbTimePoint[]>(() => {
    if (!wbData) return []
    const allYears = [
      ...new Set([
        ...(wbData.gdpUsd || []).map((d) => d.year),
        ...(wbData.gdpGrowth || []).map((d) => d.year),
      ]),
    ].sort()

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

  const sectors = useMemo(() => {
    const shares = officialSectorSharesByYear[year] || []
    if (sector === DEFAULT_SECTOR) return shares
    return shares.filter((item) =>
      item.sector.toLocaleLowerCase('az-AZ').includes(sector.toLocaleLowerCase('az-AZ')),
    )
  }, [sector, year])

  const totals = useMemo(() => {
    const revenue = selectedMacro.gdp / 1000
    const expense = selectedMacro.oilGasGdp / 1000
    const profit = selectedMacro.nonOilGdp / 1000
    return { revenue, expense, profit, margin: revenue ? (profit / revenue) * 100 : 0 }
  }, [selectedMacro])

  const clearFilters = useCallback(() => {
    setYear(DEFAULT_YEAR)
    setSector(DEFAULT_SECTOR)
    setDrillSector(null)
  }, [])

  return {
    year,
    setYear,
    sector,
    setSector,
    drillSector,
    setDrillSector,
    sectors,
    totals,
    selectedMacro,
    previousMacro,
    officialSectorShares: officialSectorSharesByYear[year] || [],
    wbData,
    wbLoading,
    wbError,
    fetchedAt,
    wbYear,
    wbTimeSeries,
    clearFilters,
  }
}
