import {
  adoptionTrend,
  annualOfficialMacro,
  empiricalImpact,
  governanceLayers,
  kpiRows,
  officialSectorSharesByYear,
  platformComparison,
  sourceLinks,
} from '../data/dashboardData.js'

function downloadFile(filename, mimeType, content) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function escapeCell(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function tableToHtml(title, rows) {
  if (!rows.length) return `<h2>${escapeCell(title)}</h2><p>Data yoxdur</p>`
  const columns = Object.keys(rows[0])
  const header = columns.map((key) => `<th>${escapeCell(key)}</th>`).join('')
  const body = rows
    .map((row) => `<tr>${columns.map((key) => `<td>${escapeCell(row[key])}</td>`).join('')}</tr>`)
    .join('')
  return `<h2>${escapeCell(title)}</h2><table border="1"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`
}

function toCsv(rows) {
  if (!rows.length) return ''
  const columns = Object.keys(rows[0])
  const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  return [columns.map(quote).join(','), ...rows.map((row) => columns.map((key) => quote(row[key])).join(','))].join('\n')
}

export function buildDashboardExport(context) {
  const { year, sector, sectors, totals, selectedMacro } = context
  const summary = [
    { göstərici: 'İl', dəyər: year },
    { göstərici: 'Sektor', dəyər: sector },
    { göstərici: 'Dövr', dəyər: selectedMacro?.period || '' },
    { göstərici: 'Mənbə', dəyər: selectedMacro?.source || '' },
    { göstərici: 'Ümumi göstərici', dəyər: totals.revenue.toFixed(1) },
    { göstərici: 'Müqayisəli xərc göstəricisi', dəyər: totals.expense.toFixed(1) },
    { göstərici: 'Fərq', dəyər: totals.profit.toFixed(1) },
    { göstərici: 'Marja', dəyər: `${totals.margin.toFixed(1)}%` },
  ]

  return {
    summary,
    annualOfficialMacro,
    selectedYearMacro: selectedMacro ? [selectedMacro] : [],
    officialSectorShares: officialSectorSharesByYear[year] || [],
    sectors,
    kpiRows,
    platformComparison,
    empiricalImpact,
    adoptionTrend,
    governanceLayers,
    sourceLinks,
  }
}

export function exportDashboardExcel(context) {
  const data = buildDashboardExport(context)
  const html = Object.entries(data)
    .map(([title, rows]) => tableToHtml(title, Array.isArray(rows) ? rows : []))
    .join('<br/>')

  downloadFile(
    `vizual-bi-dashboard-${context.year}.xls`,
    'application/vnd.ms-excel;charset=utf-8',
    `<html><head><meta charset="utf-8" /></head><body>${html}</body></html>`,
  )
}

export function exportDashboardCsv(context) {
  const data = buildDashboardExport(context)
  const rows = [
    ...data.summary,
    ...annualOfficialMacro.map((item) => ({ bölmə: 'Rəsmi illik makro göstəricilər', ...item })),
    ...(officialSectorSharesByYear[context.year] || []).map((item) => ({ bölmə: `${context.year} ÜDM sektor payları`, ...item })),
  ]
  downloadFile(`vizual-bi-dashboard-${context.year}.csv`, 'text/csv;charset=utf-8', `\ufeff${toCsv(rows)}`)
}

export function exportDashboardJson(context) {
  const data = buildDashboardExport(context)
  downloadFile(
    `vizual-bi-dashboard-${context.year}.json`,
    'application/json;charset=utf-8',
    JSON.stringify(data, null, 2),
  )
}

export function copySummary(context) {
  const text = [
    `İl: ${context.year}`,
    `Sektor: ${context.sector}`,
    `Ümumi göstərici: ${context.totals.revenue.toFixed(1)}`,
    `Fərq: ${context.totals.profit.toFixed(1)}`,
    `Marja: ${context.totals.margin.toFixed(1)}%`,
  ].join('\n')
  return navigator.clipboard.writeText(text)
}
