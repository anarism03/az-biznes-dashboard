import { azNumber } from '../../utils/formatters.js'

export function fmt(val, dec = 1) {
  if (val === null || val === undefined) return '—'
  return azNumber(val, dec)
}

export function usdBillion(val) {
  if (!val) return '—'
  return `${azNumber(val / 1e9, 2)} mlrd USD`
}
