import { useOutletContext } from 'react-router-dom'
import type { MessageInstance } from 'antd/es/message/interface'
import { exportDashboardExcel } from '../../utils/exportData'
import type { DashboardFilters, IndicatorBar, KpiCardProps } from '../../types/dashboard'
import { pctDelta } from './utils'

export function useOverview(message: MessageInstance) {
  const filters = useOutletContext<DashboardFilters>()
  const {
    year,
    setYear,
    sector,
    setSector,
    drillSector,
    setDrillSector,
    sectors,
    selectedMacro,
    previousMacro,
    wbYear,
    wbLoading,
    wbError,
    wbTimeSeries,
    fetchedAt,
    officialSectorShares,
    clearFilters,
  } = filters

  const selectedIndicators: IndicatorBar[] = [
    { name: 'ÜDM', value: selectedMacro.gdp },
    { name: 'Qeyri-neft ÜDM', value: selectedMacro.nonOilGdp },
    { name: 'Sənaye', value: selectedMacro.industry },
    { name: 'Q/N sənaye', value: selectedMacro.nonOilIndustry },
    { name: 'İnvestisiya', value: selectedMacro.investment },
    { name: 'K/T', value: selectedMacro.agriculture },
    selectedMacro.transportStorage ? { name: 'Nəqliyyat', value: selectedMacro.transportStorage } : null,
    selectedMacro.ictServices ? { name: 'İKT', value: selectedMacro.ictServices } : null,
    selectedMacro.retailTrade ? { name: 'Ticarət', value: selectedMacro.retailTrade } : null,
  ].filter(Boolean) as IndicatorBar[]

  const dskKpis: KpiCardProps[] = [
    {
      label: 'ÜDM (AZN)',
      value: selectedMacro.gdp / 1000,
      unit: 'mlrd AZN',
      change: selectedMacro.growth,
      source: selectedMacro.source,
      tone: 'teal',
    },
    {
      label: 'Qeyri-neft/qaz ÜDM',
      value: selectedMacro.nonOilGdp / 1000,
      unit: 'mlrd AZN',
      change: selectedMacro.nonOilGrowth,
      source: 'Dövlət Statistika Komitəsi',
      tone: 'blue',
    },
    {
      label: 'Sənaye məhsulu',
      value: selectedMacro.industry / 1000,
      unit: 'mlrd AZN',
      change: pctDelta(selectedMacro.industry, previousMacro?.industry) ?? 0,
      changeText:
        pctDelta(selectedMacro.industry, previousMacro?.industry) === null
          ? selectedMacro.status
          : undefined,
      source: 'Dövlət Statistika Komitəsi',
      tone: 'amber',
    },
    {
      label: 'Əsas kapital investisiya',
      value: selectedMacro.investment / 1000,
      unit: 'mlrd AZN',
      change: pctDelta(selectedMacro.investment, previousMacro?.investment) ?? 0,
      changeText:
        pctDelta(selectedMacro.investment, previousMacro?.investment) === null
          ? selectedMacro.status
          : undefined,
      source: 'Dövlət Statistika Komitəsi',
      tone: 'rose',
    },
  ]

  const downloadReport = () => {
    exportDashboardExcel(filters)
    message.success('Hesabat Excel formatında endirildi')
  }

  const scrollToPanel = () => {
    document.getElementById('live-dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleYearSelect = (nextYear: string) => {
    if (!nextYear) return
    setYear(nextYear)
    message.info(`${nextYear} ili seçildi — digər qrafiklər sinxron yeniləndi`)
  }

  const openSectorDrill = (name: string) => {
    setDrillSector(name)
  }

  return {
    year,
    setYear,
    sector,
    setSector,
    drillSector,
    setDrillSector,
    sectors,
    selectedMacro,
    previousMacro,
    wbYear,
    wbLoading,
    wbError,
    wbTimeSeries,
    fetchedAt,
    officialSectorShares,
    selectedIndicators,
    dskKpis,
    downloadReport,
    scrollToPanel,
    handleYearSelect,
    openSectorDrill,
    clearFilters,
  }
}
