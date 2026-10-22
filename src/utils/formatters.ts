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

/** Sector palette built from Azerbaijan flag blue / red / green + neutrals (flat solids). */
const SECTOR_COLORS: Record<string, string> = {
  'Neft-qaz': '#00b5e2',
  Ticarət: '#e4002b',
  Maliyyə: '#509e2f',
  Turizm: '#007a99',
  İKT: '#e4002b',
  Logistika: '#334155',
  Sənaye: '#00b5e2',
  'Ticarət və nəqliyyat vasitələrinin təmiri': '#e4002b',
  'Nəqliyyat və anbar təsərrüfatı': '#334155',
  Tikinti: '#b45309',
  'Kənd təsərrüfatı': '#509e2f',
  'Turistlərin yerləşdirilməsi və ictimai iaşə': '#007a99',
  'İnformasiya və rabitə': '#e4002b',
  'Digər sahələr': '#64748b',
  'Məhsula və idxala xalis vergilər': '#9f1239',
}

export function sectorColor(sector: string): string {
  return SECTOR_COLORS[sector] || '#00b5e2'
}
