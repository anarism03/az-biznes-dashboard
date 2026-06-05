
const BASE = 'https://api.worldbank.org/v2'
const COUNTRY = 'AZE'

export const WB_INDICATORS = {
  gdpUsd:       { code: 'NY.GDP.MKTP.CD',       label: 'ÜDM (cari USD)' },
  gdpGrowth:    { code: 'NY.GDP.MKTP.KD.ZG',    label: 'ÜDM artımı (real, %)' },
  gdpPerCapita: { code: 'NY.GDP.PCAP.CD',        label: 'Adambaşına ÜDM (USD)' },
  inflation:    { code: 'FP.CPI.TOTL.ZG',        label: 'İnflyasiya (istehlakçı qiymətləri, %)' },
  exports:      { code: 'NE.EXP.GNFS.ZS',        label: 'İxrac (ÜDM-in %-i)' },
  imports:      { code: 'NE.IMP.GNFS.ZS',        label: 'İdxal (ÜDM-in %-i)' },
  fdi:          { code: 'BX.KLT.DINV.WD.GD.ZS',  label: 'Birbaşa xarici investisiya (ÜDM-in %-i)' },
  unemployment: { code: 'SL.UEM.TOTL.ZS',        label: 'İşsizlik (%)' },
  industryShare:{ code: 'NV.IND.TOTL.ZS',        label: 'Sənaye payı (ÜDM-in %-i)' },
  agriShare:    { code: 'NV.AGR.TOTL.ZS',        label: 'Kənd təsərrüfatı payı (ÜDM-in %-i)' },
}

/** Bir göstərici üçün son 10 ilin datasını gətirir */
async function fetchIndicator(indicatorCode, yearsBack = 12) {
  const url = `${BASE}/country/${COUNTRY}/indicator/${indicatorCode}?format=json&per_page=${yearsBack}&mrv=${yearsBack}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`World Bank API xətası: ${response.status}`)
  const [, rawData] = await response.json()
  if (!Array.isArray(rawData)) return []
  return rawData
    .filter(item => item.value !== null)
    .map(item => ({ year: String(item.date), value: item.value }))
    .sort((a, b) => Number(a.year) - Number(b.year))
}

/** Bütün göstəriciləri parallel olaraq gətirir */
export async function fetchAllAzerbaijanData() {
  const entries = Object.entries(WB_INDICATORS)
  const results = await Promise.allSettled(
    entries.map(async ([key, { code }]) => {
      const data = await fetchIndicator(code)
      return [key, data]
    })
  )

  const merged = {}
  results.forEach((result, i) => {
    const key = entries[i][0]
    if (result.status === 'fulfilled') {
      merged[key] = result.value[1]
    } else {
      console.warn(`[WorldBank] ${key} yüklənmədi:`, result.reason?.message)
      merged[key] = []
    }
  })
  return merged
}

/**
 * Verilmiş il üçün müəyyən göstəricinin dəyərini tapır.
 * Həmin il məlumat yoxdursa, ən yaxın əvvəlki ili qaytarır.
 */
export function getValueForYear(series = [], year) {
  const exact = series.find(d => d.year === String(year))
  if (exact) return exact.value
  // Ən yaxın əvvəlki
  const before = series.filter(d => Number(d.year) <= Number(year))
  return before.length ? before[before.length - 1].value : null
}
