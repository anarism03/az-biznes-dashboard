import { useMemo, useState } from 'react'
import {
  annualOfficialMacro,
  officialSectorSharesByYear,
} from '../data/dashboardData.js'
import { useWorldBankData } from './useWorldBankData.js'
import { getValueForYear } from '../services/worldBankApi.js'

export function useDashboardFilters() {
  const [year, setYear]     = useState('2023')
  const [sector, setSector] = useState('Hamısı')

  // World Bank real data
  const { wbData, wbLoading, wbError, fetchedAt } = useWorldBankData()

  // DSK (yerli) data
  const selectedMacro = useMemo(
    () => annualOfficialMacro.find(item => item.year === year) || annualOfficialMacro.at(-1),
    [year],
  )

  // Seçilmiş il üçün World Bank göstəriciləri
  const wbYear = useMemo(() => {
    if (!wbData) return null
    return {
      gdpUsd:       getValueForYear(wbData.gdpUsd, year),
      gdpGrowth:    getValueForYear(wbData.gdpGrowth, year),
      gdpPerCapita: getValueForYear(wbData.gdpPerCapita, year),
      inflation:    getValueForYear(wbData.inflation, year),
      exports:      getValueForYear(wbData.exports, year),
      imports:      getValueForYear(wbData.imports, year),
      fdi:          getValueForYear(wbData.fdi, year),
      unemployment: getValueForYear(wbData.unemployment, year),
      industryShare:getValueForYear(wbData.industryShare, year),
      agriShare:    getValueForYear(wbData.agriShare, year),
    }
  }, [wbData, year])

  // Bütün illik sıra (qrafiklər üçün)
  const wbTimeSeries = useMemo(() => {
    if (!wbData) return []
    // Mövcud illərin unifikasiyası
    const allYears = [...new Set([
      ...( wbData.gdpUsd       || []).map(d => d.year),
      ...( wbData.gdpGrowth    || []).map(d => d.year),
    ])].sort()

    return allYears.map(y => ({
      year: y,
      gdpUsd:       getValueForYear(wbData.gdpUsd, y),
      gdpGrowthPct: getValueForYear(wbData.gdpGrowth, y),
      gdpPerCapita: getValueForYear(wbData.gdpPerCapita, y),
      inflation:    getValueForYear(wbData.inflation, y),
      exports:      getValueForYear(wbData.exports, y),
      imports:      getValueForYear(wbData.imports, y),
      unemployment: getValueForYear(wbData.unemployment, y),
    }))
  }, [wbData])

  const sectors = useMemo(() => {
    const shares = officialSectorSharesByYear[year] || []
    if (sector === 'Hamısı') return shares
    return shares.filter(item =>
      item.sector.toLocaleLowerCase('az-AZ').includes(sector.toLocaleLowerCase('az-AZ'))
    )
  }, [sector, year])

  const totals = useMemo(() => {
    const revenue = selectedMacro.gdp / 1000
    const expense = selectedMacro.oilGasGdp / 1000
    const profit  = selectedMacro.nonOilGdp / 1000
    return { revenue, expense, profit, margin: (profit / revenue) * 100 }
  }, [selectedMacro])

  return {
    year, setYear,
    sector, setSector,
    sectors, totals,
    selectedMacro,
    officialSectorShares: officialSectorSharesByYear[year] || [],
    // Real API data
    wbData, wbLoading, wbError, fetchedAt,
    wbYear,
    wbTimeSeries,
  }
}
