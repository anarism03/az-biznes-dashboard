import { useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'motion/react'
import { azNumber } from '../../utils/formatters'

interface AnimatedNumberProps {
  value: number | null | undefined
  digits?: number
  className?: string
}

/** Dəyər dəyişəndə rəqəm köhnə dəyərdən yenisinə axır (Intl ilə düzgün yuvarlaqlaşdırma). */
export function AnimatedNumber({ value, digits = 1, className }: AnimatedNumberProps) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(value ?? 0)
  const from = useRef(value ?? 0)

  useEffect(() => {
    if (value === null || value === undefined) return
    if (reduce) {
      setDisplay(value)
      from.current = value
      return
    }
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    })
    from.current = value
    return () => controls.stop()
  }, [value, reduce])

  if (value === null || value === undefined) return <span className={className}>—</span>
  return <span className={`num ${className ?? ''}`}>{azNumber(display, digits)}</span>
}
