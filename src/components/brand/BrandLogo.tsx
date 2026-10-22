import { Flame } from 'lucide-react'

interface BrandLogoProps {
  size?: number
  className?: string
  title?: string
}

/** Flat AZ flag stripes + flame mark (no gradients). */
export function BrandLogo({ size = 40, className = '', title }: BrandLogoProps) {
  const flame = Math.round(size * 0.52)
  return (
    <div
      className={`brand-logo ${className}`.trim()}
      style={{ width: size, height: size }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <span className="brand-logo__stripe brand-logo__stripe--blue" />
      <span className="brand-logo__stripe brand-logo__stripe--red" />
      <span className="brand-logo__stripe brand-logo__stripe--green" />
      <Flame className="brand-logo__flame" size={flame} strokeWidth={2.35} />
    </div>
  )
}
