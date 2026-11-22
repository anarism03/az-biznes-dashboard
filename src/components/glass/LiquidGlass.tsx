import { forwardRef, useEffect, useRef, type ElementType, type HTMLAttributes } from 'react'

type LiquidGlassProps = {
  as?: ElementType
  interactive?: boolean
  chrome?: boolean
  refract?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
} & HTMLAttributes<HTMLElement>

/**
 * Liquid glass səthi: arxa fon bulanıq görünür, kənarda işıq zolağı var,
 * siçan hərəkət etdikcə parıltı kursoru izləyir (--gx / --gy).
 */
export const LiquidGlass = forwardRef<HTMLElement, LiquidGlassProps>(function LiquidGlass(
  { as, interactive = true, chrome = false, refract = false, className = '', onPointerMove, ...props },
  forwarded,
) {
  const Comp = (as || 'div') as ElementType
  const local = useRef<HTMLElement | null>(null)

  return (
    <Comp
      ref={(node: HTMLElement | null) => {
        local.current = node
        if (typeof forwarded === 'function') forwarded(node)
        else if (forwarded) forwarded.current = node
      }}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        onPointerMove?.(e)
        if (!interactive || e.pointerType !== 'mouse' || !local.current) return
        const r = local.current.getBoundingClientRect()
        local.current.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`)
        local.current.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`)
      }}
      className={`liquid-glass ${chrome ? 'is-chrome' : ''} ${refract ? 'refract' : ''} ${className}`.trim()}
      {...props}
    />
  )
})

/** Sınma filtri: yalnız Chromium + siçan olanda aktivləşir, mobil GPU-nu yormur. */
export function LiquidGlassFilter() {
  useEffect(() => {
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData
      ?.brands
    const chromium = brands?.some((b) => /Chromium/i.test(b.brand))
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    if (chromium && fine && !reduce) document.documentElement.dataset.glass = 'refract'
  }, [])

  return (
    <svg aria-hidden width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <filter id="az-liquid" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="30" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}

export function AmbientBackdrop() {
  return (
    <div className="ambient" aria-hidden>
      <span className="ambient__blob ambient__blob--a" />
      <span className="ambient__blob ambient__blob--b" />
      <span className="ambient__blob ambient__blob--c" />
      <span className="ambient__grain" />
    </div>
  )
}
