export function azNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('az-AZ', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}

export function azCurrency(value: number, digits = 1): string {
  return `${azNumber(value, digits)} mln AZN`
}

export function trendClass(value: number): 'trend-up' | 'trend-down' | 'trend-flat' {
  if (value > 0) return 'trend-up'
  if (value < 0) return 'trend-down'
  return 'trend-flat'
}

const SECTOR_COLORS: Record<string, string> = {
  'Neft-qaz': '#0a6e6a',
  Ticarət: '#1d4ed8',
  Maliyyə: '#0f766e',
  Turizm: '#b45309',
  İKT: '#be123c',
  Logistika: '#334155',
  Sənaye: '#0a6e6a',
  'Ticarət və nəqliyyat vasitələrinin təmiri': '#1d4ed8',
  'Nəqliyyat və anbar təsərrüfatı': '#334155',
  Tikinti: '#b45309',
  'Kənd təsərrüfatı': '#15803d',
  'Turistlərin yerləşdirilməsi və ictimai iaşə': '#0369a1',
  'İnformasiya və rabitə': '#be123c',
  'Digər sahələr': '#64748b',
  'Məhsula və idxala xalis vergilər': '#9f1239',
}

export function sectorColor(sector: string): string {
  return SECTOR_COLORS[sector] || '#0a6e6a'
}
