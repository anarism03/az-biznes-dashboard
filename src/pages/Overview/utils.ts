import { azNumber } from '../../utils/formatters'

export function fmt(val: number | null | undefined, dec = 1): string {
  if (val === null || val === undefined) return '—'
  return azNumber(val, dec)
}

export function usdBillion(val: number | null | undefined): string {
  if (!val) return '—'
  return `${azNumber(val / 1e9, 2)} mlrd USD`
}

export function pctDelta(current: number, previous: number | null | undefined): number | null {
  if (previous === null || previous === undefined || previous === 0) return null
  return ((current - previous) / Math.abs(previous)) * 100
}
