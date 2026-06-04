import { useMemo, useState } from 'react'
import {
  annualOfficialMacro,
  officialSectorSharesByYear,
} from '../data/dashboardData.js'

export function useDashboardFilters() {
  const [year, setYear] = useState('2025')
  const [sector, setSector] = useState('Hamısı')

  const selectedMacro = useMemo(
    () => annualOfficialMacro.find((item) => item.year === year) || annualOfficialMacro.at(-1),
    [year],
  )

  const sectors = useMemo(() => {
    const shares = officialSectorSharesByYear[year] || []
    if (sector === 'Hamısı') return shares
    return shares.filter((item) => item.sector.toLocaleLowerCase('az-AZ').includes(sector.toLocaleLowerCase('az-AZ')))
  }, [sector, year])

  const totals = useMemo(() => {
    const revenue = selectedMacro.gdp / 1000
    const expense = selectedMacro.oilGasGdp / 1000
    const profit = selectedMacro.nonOilGdp / 1000
    return { revenue, expense, profit, margin: (profit / revenue) * 100 }
  }, [selectedMacro])

  return {
    year,
    setYear,
    sector,
    setSector,
    sectors,
    totals,
    selectedMacro,
    officialSectorShares: officialSectorSharesByYear[year] || [],
  }
}
