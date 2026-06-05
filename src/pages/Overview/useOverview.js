import { useOutletContext } from 'react-router-dom'
import { exportDashboardExcel } from '../../utils/exportData.js'

export function useOverview(message) {
  const filters = useOutletContext()
  const { year, sector, sectors, selectedMacro, wbYear, wbLoading, wbError, wbTimeSeries, fetchedAt } = filters
  const wbData = wbYear || {}

  const selectedIndicators = [
    { name: 'ÜDM', value: selectedMacro.gdp },
    { name: 'Qeyri-neft ÜDM', value: selectedMacro.nonOilGdp },
    { name: 'Sənaye', value: selectedMacro.industry },
    { name: 'Q/N sənaye', value: selectedMacro.nonOilIndustry },
    { name: 'İnvestisiya', value: selectedMacro.investment },
    { name: 'K/T', value: selectedMacro.agriculture },
    selectedMacro.transportStorage ? { name: 'Nəqliyyat', value: selectedMacro.transportStorage } : null,
    selectedMacro.ictServices ? { name: 'İKT', value: selectedMacro.ictServices } : null,
    selectedMacro.retailTrade ? { name: 'Ticarət', value: selectedMacro.retailTrade } : null,
  ].filter(Boolean)

  const dskKpis = [
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
      change: 0,
      changeText: selectedMacro.status,
      source: 'Dövlət Statistika Komitəsi',
      tone: 'amber',
    },
    {
      label: 'Əsas kapital investisiya',
      value: selectedMacro.investment / 1000,
      unit: 'mlrd AZN',
      change: 0,
      changeText: selectedMacro.status,
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

  return {
    year, sectors, selectedMacro, wbYear, wbLoading, wbError, wbTimeSeries, fetchedAt, wbData,
    selectedIndicators, dskKpis, downloadReport, scrollToPanel
  }
}
