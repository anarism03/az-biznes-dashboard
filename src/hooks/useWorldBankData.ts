import { useEffect, useState } from 'react'
import { fetchAllAzerbaijanData } from '../services/worldBankApi'
import type { WbDataset } from '../types/dashboard'

const CACHE_KEY = 'wb_az_data_v1'
const CACHE_TTL = 10 * 60 * 1000

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
    /* ignore quota errors */
  }
}

export function useWorldBankData() {
  const cached = loadCache()
  const [wbData, setWbData] = useState<WbDataset | null>(cached?.data ?? null)
  const [wbLoading, setWbLoading] = useState(!cached)
  const [wbError, setWbError] = useState<string | null>(null)
  const [fetchedAt, setFetchedAt] = useState<Date | null>(cached ? new Date(cached.timestamp) : null)

  useEffect(() => {
    let cancelled = false
    setWbLoading(true)
    setWbError(null)

    fetchAllAzerbaijanData()
      .then((data) => {
        if (cancelled) return
        setWbData(data)
        setFetchedAt(new Date())
        saveCache(data)
      })
      .catch((err: Error) => {
        if (cancelled) return
        console.error('[WorldBank] Yükləmə xətası:', err)
        setWbError(err.message)
      })
      .finally(() => {
        if (!cancelled) setWbLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { wbData, wbLoading, wbError, fetchedAt }
}
