import { useEffect } from 'react'

type Handler = (e: KeyboardEvent) => void

/** Sadə qısayol qeydiyyatı. Yazı sahəsində olanda (input/textarea) tək hərfli qısayollar işləmir. */
export function useHotkeys(map: Record<string, Handler>, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      const combo = `${e.metaKey || e.ctrlKey ? 'mod+' : ''}${e.shiftKey && e.key.length > 1 ? 'shift+' : ''}${e.key.toLowerCase()}`
      const handler = map[combo]
      if (!handler) return
      if (typing && !combo.startsWith('mod+') && combo !== 'escape') return
      e.preventDefault()
      handler(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [map, enabled])
}
