export function azNumber(value, digits = 0) {
  return new Intl.NumberFormat('az-AZ', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}

export function azCurrency(value, digits = 1) {
  return `${azNumber(value, digits)} mln AZN`
}

export function trendClass(value) {
  if (value > 0) return 'trend-up'
  if (value < 0) return 'trend-down'
  return 'trend-flat'
}

export function sectorColor(sector) {
  const colors = {
    'Neft-qaz': '#0f766e',
    Ticarət: '#2563eb',
    Maliyyə: '#7c3aed',
    Turizm: '#b45309',
    İKT: '#dc2626',
    Logistika: '#475569',
    Sənaye: '#0f766e',
    'Ticarət və nəqliyyat vasitələrinin təmiri': '#2563eb',
    'Nəqliyyat və anbar təsərrüfatı': '#475569',
    Tikinti: '#b45309',
    'Kənd təsərrüfatı': '#16803c',
    'Turistlərin yerləşdirilməsi və ictimai iaşə': '#7c3aed',
    'İnformasiya və rabitə': '#dc2626',
    'Digər sahələr': '#64748b',
    'Məhsula və idxala xalis vergilər': '#be123c',
  }
  return colors[sector] || '#0f766e'
}
