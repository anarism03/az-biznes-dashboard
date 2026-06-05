import { useState, useEffect } from 'react'
import { fetchAllAzerbaijanData } from '../services/worldBankApi.js'

const CACHE_KEY = 'wb_az_data_v1'
const CACHE_TTL = 10 * 60 * 1000 // 10 dəqiqə

function loadCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return { data, timestamp }
  } catch {
    return null
  }
}

function saveCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // sessionStorage dolubsa keç
  }
}

/**
 * World Bank API-dən Azərbaycanın iqtisadi göstəricilərini yükləyir.
 * 10 dəqiqəlik sessionStorage cache istifadə edir.
 */
export function useWorldBankData() {
  const [wbData, setWbData]       = useState(null)
  const [wbLoading, setWbLoading] = useState(true)
  const [wbError, setWbError]     = useState(null)
  const [fetchedAt, setFetchedAt] = useState(null)

  useEffect(() => {
    setWbLoading(true)
    setWbError(null)

    fetchAllAzerbaijanData()
      .then(data => {
        setWbData(data)
        setFetchedAt(new Date())
        saveCache(data)
      })
      .catch(err => {
        console.error('[WorldBank] Yükləmə xətası:', err)
        setWbError(err.message)
      })
      .finally(() => {
        setWbLoading(false)
      })
  }, [])

  return { wbData, wbLoading, wbError, fetchedAt }
}
