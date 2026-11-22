import {
  annualOfficialMacro,
  governanceLayers,
  kpiRows,
  officialSectorSharesByYear,
  platformComparison,
  sourceLinks,
} from '../data/dashboardData'
import {
  barriers,
  decisionUse,
  likertRows,
  reportTime,
  surveySectors,
  trainingNeed,
  usageFrequency,
} from '../data/survey'
import type { DashboardFilters } from '../types/dashboard'
import { azNumber } from './formatters'

function downloadFile(filename: string, mimeType: string, content: string) {
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

function escapeCell(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function tableToHtml(title: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return `<h2>${escapeCell(title)}</h2><p>Məlumat yoxdur</p>`
  const columns = Object.keys(rows[0])
  const header = columns.map((key) => `<th>${escapeCell(key)}</th>`).join('')
  const body = rows
    .map((row) => `<tr>${columns.map((key) => `<td>${escapeCell(row[key])}</td>`).join('')}</tr>`)
    .join('')
  return `<h2>${escapeCell(title)}</h2><table border="1"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`
}

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return ''
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))]
  const quote = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
  return [columns.map(quote).join(','), ...rows.map((row) => columns.map((key) => quote(row[key])).join(','))].join('\n')
}

type ExportContext = Pick<DashboardFilters, 'year' | 'sector' | 'sectors' | 'selectedMacro'>

const withShare = (items: { label: string; count: number }[], base = 29) =>
  items.map((item) => ({ cavab: item.label, say: item.count, faiz: `${azNumber((item.count / base) * 100, 1)}%` }))

export function buildDashboardExport(context: ExportContext) {
  const { year, sector, sectors, selectedMacro } = context
  const summary = [
    { göstərici: 'Seçilmiş il', dəyər: year },
    { göstərici: 'Sektor filtri', dəyər: sector },
    { göstərici: 'Dövr', dəyər: selectedMacro.period },
    { göstərici: 'Status', dəyər: selectedMacro.status },
    { göstərici: 'ÜDM, mlrd AZN', dəyər: azNumber(selectedMacro.gdp / 1000, 1) },
    { göstərici: 'Qeyri-neft/qaz ÜDM, mlrd AZN', dəyər: azNumber(selectedMacro.nonOilGdp / 1000, 1) },
    { göstərici: 'Neft/qaz ÜDM, mlrd AZN', dəyər: azNumber(selectedMacro.oilGasGdp / 1000, 1) },
    { göstərici: 'Real ÜDM artımı, %', dəyər: azNumber(selectedMacro.growth, 1) },
    { göstərici: 'Qeyri-neft/qaz artımı, %', dəyər: azNumber(selectedMacro.nonOilGrowth, 1) },
    { göstərici: 'Mənbə', dəyər: selectedMacro.source },
  ]

  return {
    'Xülasə': summary,
    'Rəsmi illik makro göstəricilər (mln AZN)': annualOfficialMacro,
    [`${year} ÜDM sektor payları`]: officialSectorSharesByYear[year] || [],
    'Filtrə uyğun sektorlar': sectors,
    'Sorğu: sektorlar (n=29)': withShare(surveySectors),
    'Sorğu: istifadə tezliyi (n=29)': withShare(usageFrequency),
    'Sorğu: qərar hazırlığında istifadə (n=29)': withShare(decisionUse),
    'Sorğu: fayda ifadələri (n=29)': likertRows.map((row) => ({
      ifadə: row.statement,
      müsbət: row.positive,
      neytral: row.neutral,
      mənfi: row.negative,
    })),
    'Sorğu: hesabat vaxtı (n=29)': withShare(reportTime),
    'Sorğu: təlim ehtiyacı (n=29)': withShare(trainingNeed),
    'Sorğu: tətbiq maneələri (çoxseçimli, n=29)': withShare(barriers),
    'KPI lüğəti': kpiRows,
    'Platformaların keyfiyyət müqayisəsi': platformComparison,
    'Məlumat xətti': governanceLayers.map((item) => ({ qat: item.layer, izah: item.text, yoxlama: item.checks.join('; ') })),
    'Mənbələr': sourceLinks,
  }
}

export function exportDashboardExcel(context: ExportContext) {
  const data = buildDashboardExport(context)
  const html = Object.entries(data)
    .map(([title, rows]) => tableToHtml(title, rows as unknown as Record<string, unknown>[]))
    .join('<br/>')

  downloadFile(
    `azerdash-hesabat-${context.year}.xls`,
    'application/vnd.ms-excel;charset=utf-8',
    `<html><head><meta charset="utf-8" /></head><body>${html}</body></html>`,
  )
}

export function exportDashboardCsv(context: ExportContext) {
  const data = buildDashboardExport(context)
  const rows: Record<string, unknown>[] = Object.entries(data).flatMap(([section, items]) =>
    (items as unknown as Record<string, unknown>[]).map((item) => ({ bölmə: section, ...item })),
  )
  downloadFile(`azerdash-hesabat-${context.year}.csv`, 'text/csv;charset=utf-8', `﻿${toCsv(rows)}`)
}

export function exportDashboardJson(context: ExportContext) {
  const data = buildDashboardExport(context)
  downloadFile(
    `azerdash-hesabat-${context.year}.json`,
    'application/json;charset=utf-8',
    JSON.stringify(data, null, 2),
  )
}

export function buildSummaryText(context: ExportContext) {
  const m = context.selectedMacro
  return [
    `AzərDash — ${m.period}`,
    `ÜDM: ${azNumber(m.gdp / 1000, 1)} mlrd AZN (real artım ${azNumber(m.growth, 1)}%)`,
    `Qeyri-neft/qaz ÜDM: ${azNumber(m.nonOilGdp / 1000, 1)} mlrd AZN (artım ${azNumber(m.nonOilGrowth, 1)}%)`,
    `Sənaye məhsulu: ${azNumber(m.industry / 1000, 1)} mlrd AZN`,
    `Əsas kapitala investisiya: ${azNumber(m.investment / 1000, 1)} mlrd AZN`,
    `Status: ${m.status}. Mənbə: ${m.source}`,
  ].join('\n')
}

export async function copySummary(context: ExportContext) {
  await navigator.clipboard.writeText(buildSummaryText(context))
}
