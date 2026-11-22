import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { LiquidGlass } from '../glass/LiquidGlass'
import { AnimatedNumber } from './AnimatedNumber'
import { azNumber } from '../../utils/formatters'
import type { KpiCardProps } from '../../types/dashboard'

const TONE: Record<string, string> = {
  blue: 'var(--az-blue)',
  teal: 'var(--az-blue)',
  green: 'var(--az-green)',
  red: 'var(--az-red)',
  rose: 'var(--az-red)',
  amber: 'var(--amber)',
  violet: 'var(--slate)',
}

export function KpiCard({
  label,
  value,
  unit,
  digits = 1,
  change,
  changeLabel,
  source,
  tone = 'blue',
  active = false,
  onClick,
  spark,
  sparkActiveIndex,
}: KpiCardProps) {
  const color = TONE[tone] ?? TONE.blue
  const hasChange = change !== null && change !== undefined
  const dir = !hasChange ? 'flat' : change! > 0.05 ? 'up' : change! < -0.05 ? 'down' : 'flat'
  const Icon = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : Minus
  const gradientId = `spark-${label.replace(/[^a-z0-9]/gi, '')}`

  return (
    <LiquidGlass
      as={onClick ? 'button' : 'div'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`kpi ${onClick ? 'is-interactive press' : ''} ${active ? 'is-active' : ''}`}
    >
      <div className="kpi__head">
        <span className="kpi__label">
          <span className="kpi__swatch" style={{ background: color }} />
          {label}
        </span>
        {hasChange || changeLabel ? (
          <span className={`delta delta--${dir}`} title={changeLabel}>
            {hasChange ? (
              <>
                <Icon size={14} strokeWidth={2.4} />
                {`${change! > 0 ? '+' : ''}${azNumber(change!, 1)}%`}
              </>
            ) : (
              changeLabel
            )}
          </span>
        ) : null}
      </div>
      <div className="kpi__value">
        <strong>
          <AnimatedNumber value={value} digits={digits} />
        </strong>
        {unit ? <span>{unit}</span> : null}
      </div>
      {spark && spark.length > 1 ? (
        <div className="kpi__spark" aria-hidden>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 4, bottom: 2, left: 4 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
                dot={(p: { cx?: number; cy?: number; index?: number }) =>
                  p.index === sparkActiveIndex ? (
                    <circle key="d" cx={p.cx} cy={p.cy} r={3.5} fill={color} stroke="var(--bg-card)" strokeWidth={2} />
                  ) : (
                    <g key={`e${p.index}`} />
                  )
                }
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}
      {source ? <div className="kpi__foot">{source}</div> : null}
    </LiquidGlass>
  )
}
