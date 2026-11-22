import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, CornerDownLeft, Search, Shapes } from 'lucide-react'
import { LiquidGlass } from '../glass/LiquidGlass'

export interface PaletteCommand {
  id: string
  group: string
  label: string
  hint?: string
  keywords?: string
  icon?: ReactNode
  run: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  commands: PaletteCommand[]
}

const spring = { type: 'spring', bounce: 0.18, visualDuration: 0.32 } as const

const norm = (s: string) => s.toLocaleLowerCase('az-AZ')

export function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setIndex(0)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = norm(query.trim())
    if (!q) return commands
    return commands.filter((c) => norm(`${c.label} ${c.hint ?? ''} ${c.keywords ?? ''} ${c.group}`).includes(q))
  }, [commands, query])

  useEffect(() => setIndex(0), [query])

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [index])

  const run = (cmd?: PaletteCommand) => {
    if (!cmd) return
    onClose()
    // paletin bağlanma animasiyası ilə toqquşmasın
    requestAnimationFrame(() => cmd.run())
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(filtered[index])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  let lastGroup = ''

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={spring}
            style={{ width: 'min(640px, 100%)' }}
          >
            <LiquidGlass className="palette" role="dialog" aria-modal="true" aria-label="Komanda paleti">
              <div className="palette__input">
                <Search size={20} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Səhifə, il, sektor və ya əmr axtarın"
                  aria-label="Axtarış"
                  aria-activedescendant={filtered[index] ? `cmd-${filtered[index].id}` : undefined}
                />
                <span className="kbd">Esc</span>
              </div>
              <div className="palette__list" ref={listRef} role="listbox">
                {filtered.length ? (
                  filtered.map((cmd, i) => {
                    const showGroup = cmd.group !== lastGroup
                    lastGroup = cmd.group
                    return (
                      <div key={cmd.id}>
                        {showGroup ? <div className="palette__group">{cmd.group}</div> : null}
                        <button
                          id={`cmd-${cmd.id}`}
                          type="button"
                          role="option"
                          aria-selected={i === index}
                          data-index={i}
                          className="palette__item"
                          onMouseMove={() => setIndex(i)}
                          onClick={() => run(cmd)}
                        >
                          {i === index ? (
                            <motion.span layoutId="palette-lens" className="palette__item-lens" transition={spring} />
                          ) : null}
                          {cmd.icon ?? <Shapes size={18} />}
                          <span>{cmd.label}</span>
                          {cmd.hint ? <small>{cmd.hint}</small> : null}
                        </button>
                      </div>
                    )
                  })
                ) : (
                  <div className="empty">
                    <div className="empty__icon">
                      <CalendarDays size={24} />
                    </div>
                    <h4>Uyğun nəticə yoxdur</h4>
                    <p>Başqa söz yazın: məsələn, “2024”, “Sənaye” və ya “tema”.</p>
                  </div>
                )}
              </div>
              <div className="palette__foot">
                <span>
                  <span className="kbd">↑</span>
                  <span className="kbd">↓</span> seçmək
                </span>
                <span>
                  <span className="kbd">
                    <CornerDownLeft size={12} />
                  </span>{' '}
                  açmaq
                </span>
                <span className="hide-sm">
                  <span className="kbd">?</span> bütün qısayollar
                </span>
              </div>
            </LiquidGlass>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
