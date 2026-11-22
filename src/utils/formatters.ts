/**
 * Azərbaycan standartına uyğun rəqəm: minliklər boşluqla, onluq hissə vergüllə (129 094,0).
 * Brauzerin ICU dəstindən asılı olmasın deyə əl ilə formatlanır.
 */
export function azNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  const fixed = Math.abs(value).toFixed(digits)
  const [int, frac] = fixed.split('.')
  const grouped = int.length > 3 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') : int
  const sign = value < 0 && Number(fixed) !== 0 ? '−' : ''
  return `${sign}${grouped}${frac ? `,${frac}` : ''}`
}

export function azCurrency(value: number, digits = 1): string {
  return `${azNumber(value, digits)} mln AZN`
}

export function trendClass(value: number): 'trend-up' | 'trend-down' | 'trend-flat' {
  if (value > 0) return 'trend-up'
  if (value < 0) return 'trend-down'
  return 'trend-flat'
}

/** Sektor palitrası: bayraq rəngləri və neytral tonlar. Oxşar sektorlar bir-birindən ayrılsın deyə tonlar fərqlidir. */
const SECTOR_COLORS: Record<string, string> = {
  Sənaye: 'var(--az-red)',
  'Ticarət və nəqliyyat vasitələrinin təmiri': 'var(--az-blue)',
  'Nəqliyyat və anbar təsərrüfatı': '#2f7e9b',
  Tikinti: 'var(--amber)',
  'Kənd təsərrüfatı': 'var(--az-green)',
  'Turistlərin yerləşdirilməsi və ictimai iaşə': '#7a5bb5',
  'İnformasiya və rabitə': '#00a3a3',
  'Digər sahələr': 'var(--slate)',
  'Məhsula və idxala xalis vergilər': '#a3425f',
}

export function sectorColor(sector: string): string {
  return SECTOR_COLORS[sector] || 'var(--az-blue)'
}
