import { useEffect, useState } from 'react'
import { fetchAllAzerbaijanData } from '../services/worldBankApi'
import { worldBankSnapshot } from '../data/worldBankSnapshot'
import type { WbDataset } from '../types/dashboard'

const CACHE_KEY = 'wb_az_data_v2'
const CACHE_TTL = 30 * 60 * 1000

export type WbSource = 'live' | 'cache' | 'snapshot'

function loadCache(): { data: WbDataset; timestamp: number } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { data: WbDataset; timestamp: number }
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null
    return parsed
  } catch {
    return null
  }
}

function saveCache(data: WbDataset) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    /* yaddaş dolu ola bilər — keşsiz davam edirik */
  }
}

const hasData = (data: WbDataset) => Object.values(data).some((series) => series.length > 0)

export function useWorldBankData() {
  const cached = loadCache()
  const [wbData, setWbData] = useState<WbDataset>(cached?.data ?? worldBankSnapshot)
  const [wbSource, setWbSource] = useState<WbSource>(cached ? 'cache' : 'snapshot')
  const [wbLoading, setWbLoading] = useState(!cached)
  const [wbError, setWbError] = useState<string | null>(null)
  const [fetchedAt, setFetchedAt] = useState<Date | null>(cached ? new Date(cached.timestamp) : null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 9000)
    setWbLoading(true)
    setWbError(null)

    fetchAllAzerbaijanData(controller.signal)
      .then((data) => {
        if (cancelled) return
        if (!hasData(data)) throw new Error('API boş cavab qaytardı')
        setWbData(data)
        setWbSource('live')
        setFetchedAt(new Date())
        saveCache(data)
      })
      .catch((err: Error) => {
        if (cancelled) return
        setWbError(err.name === 'AbortError' ? 'API vaxtında cavab vermədi' : err.message)
      })
      .finally(() => {
        window.clearTimeout(timer)
        if (!cancelled) setWbLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [nonce])

  return { wbData, wbSource, wbLoading, wbError, fetchedAt, refetch: () => setNonce((n) => n + 1) }
}
