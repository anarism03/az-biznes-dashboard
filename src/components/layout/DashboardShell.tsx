import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { App as AntApp, Drawer, Dropdown, Modal, Select } from 'antd'
import { motion } from 'motion/react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Expand,
  FileJson,
  FileSpreadsheet,
  Keyboard,
  Link2,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Printer,
  Search,
  Shrink,
  Sun,
  Table2,
} from 'lucide-react'
import { BrandLogo } from '../brand/BrandLogo'
import { AmbientBackdrop, LiquidGlass, LiquidGlassFilter } from '../glass/LiquidGlass'
import { CommandPalette, type PaletteCommand } from './CommandPalette'
import { findNav, navigation } from '../../config/navigation'
import { sectors as sectorOptions, years } from '../../data/dashboardData'
import { useDashboardFilters } from '../../hooks/useDashboardFilters'
import { useHotkeys } from '../../hooks/useHotkeys'
import { useTheme } from '../../contexts/ThemeContext'
import { copySummary, exportDashboardCsv, exportDashboardExcel, exportDashboardJson } from '../../utils/exportData'

const spring = { type: 'spring', bounce: 0.2, visualDuration: 0.38 } as const

const shortcuts: [string, string][] = [
  ['Ctrl / ⌘ + K', 'Komanda paletini açmaq'],
  ['/', 'Axtarış'],
  ['← / →', 'Əvvəlki və ya növbəti il'],
  ['T', 'Açıq / tünd tema'],
  ['F', 'Təqdimat rejimi (tam ekran)'],
  ['P', 'Çap və ya PDF hesabatı'],
  ['?', 'Bu pəncərə'],
]

export function DashboardShell() {
  const { message } = AntApp.useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const filters = useDashboardFilters()
  const { theme, toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [presenting, setPresenting] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  const active = findNav(location.pathname)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.title = `${active.label} — AzərDash`
  }, [location.pathname, active.label])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setPresenting(false)
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const go = useCallback(
    (path: string) => {
      setMobileOpen(false)
      navigate({ pathname: path, search: location.search }, { viewTransition: true })
    },
    [navigate, location.search],
  )

  const togglePresent = useCallback(async () => {
    const next = !presenting
    setPresenting(next)
    try {
      if (next && !document.fullscreenElement) await document.documentElement.requestFullscreen()
      if (!next && document.fullscreenElement) await document.exitFullscreen()
    } catch {
      /* brauzer tam ekrana icazə verməyə bilər — rejim yenə də işləyir */
    }
  }, [presenting])

  const exportAs = useCallback(
    async (type: string) => {
      if (type === 'excel') exportDashboardExcel(filters)
      if (type === 'csv') exportDashboardCsv(filters)
      if (type === 'json') exportDashboardJson(filters)
      if (type === 'print') {
        window.print()
        return
      }
      if (type === 'copy') {
        try {
          await copySummary(filters)
          message.success('Qısa xülasə kopyalandı')
        } catch {
          message.error('Kopyalamaq alınmadı: brauzer icazə vermədi')
        }
        return
      }
      if (type === 'link') {
        try {
          await navigator.clipboard.writeText(window.location.href)
          message.success('Bu görünüşün linki kopyalandı')
        } catch {
          message.error('Linki kopyalamaq alınmadı')
        }
        return
      }
      message.success('Fayl endirildi')
    },
    [filters, message],
  )

  const themeFromEvent = (e: React.MouseEvent) => toggleTheme({ x: e.clientX, y: e.clientY })

  useHotkeys(
    useMemo(
      () => ({
        'mod+k': () => setPaletteOpen((v) => !v),
        '/': () => setPaletteOpen(true),
        arrowleft: () => filters.stepYear(-1),
        arrowright: () => filters.stepYear(1),
        t: () => toggleTheme(),
        f: () => togglePresent(),
        p: () => window.print(),
        '?': () => setHelpOpen(true),
      }),
      [filters, toggleTheme, togglePresent],
    ),
    !paletteOpen,
  )

  const commands = useMemo<PaletteCommand[]>(
    () => [
      ...navigation.map((item) => ({
        id: `nav-${item.path}`,
        group: 'Səhifələr',
        label: item.label,
        hint: item.description,
        icon: item.icon,
        run: () => go(item.path),
      })),
      ...years.map((y) => ({
        id: `year-${y}`,
        group: 'İl seçimi',
        label: `${y} ili`,
        hint: y === '2026' ? 'Yanvar–aprel, tam il deyil' : 'Tam il',
        keywords: 'il dövr',
        icon: <CalendarDays size={18} />,
        run: () => filters.setYear(y),
      })),
      ...sectorOptions.map((s) => ({
        id: `sector-${s}`,
        group: 'Sektor filtri',
        label: s,
        keywords: 'sektor',
        icon: <Table2 size={18} />,
        run: () => filters.setSector(s),
      })),
      {
        id: 'theme',
        group: 'Əmrlər',
        label: theme === 'dark' ? 'Açıq temaya keç' : 'Tünd temaya keç',
        hint: 'T',
        icon: theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />,
        run: () => toggleTheme(),
      },
      { id: 'present', group: 'Əmrlər', label: 'Təqdimat rejimi', hint: 'F', icon: <Expand size={18} />, run: togglePresent },
      { id: 'print', group: 'Əmrlər', label: 'Çap et / PDF kimi saxla', hint: 'P', icon: <Printer size={18} />, run: () => window.print() },
      { id: 'xls', group: 'Əmrlər', label: 'Excel hesabatı endir', icon: <FileSpreadsheet size={18} />, run: () => exportAs('excel') },
      { id: 'csv', group: 'Əmrlər', label: 'CSV endir', icon: <Table2 size={18} />, run: () => exportAs('csv') },
      { id: 'json', group: 'Əmrlər', label: 'JSON endir', icon: <FileJson size={18} />, run: () => exportAs('json') },
      { id: 'link', group: 'Əmrlər', label: 'Bu görünüşün linkini kopyala', icon: <Link2 size={18} />, run: () => exportAs('link') },
      { id: 'reset', group: 'Əmrlər', label: 'Filtrləri sıfırla', icon: <Shrink size={18} />, run: filters.clearFilters },
      { id: 'help', group: 'Əmrlər', label: 'Klaviatura qısayolları', hint: '?', icon: <Keyboard size={18} />, run: () => setHelpOpen(true) },
    ],
    [go, filters, theme, toggleTheme, togglePresent, exportAs],
  )

  const exportMenu = {
    items: [
      { key: 'excel', label: 'Excel hesabatı', icon: <FileSpreadsheet size={16} /> },
      { key: 'csv', label: 'CSV', icon: <Table2 size={16} /> },
      { key: 'json', label: 'JSON', icon: <FileJson size={16} /> },
      { type: 'divider' as const },
      { key: 'print', label: 'Çap / PDF', icon: <Printer size={16} /> },
      { key: 'link', label: 'Linki kopyala', icon: <Link2 size={16} /> },
      { key: 'copy', label: 'Qısa xülasəni kopyala', icon: <Copy size={16} /> },
    ],
    onClick: ({ key }: { key: string }) => exportAs(key),
  }

  const yearIdx = years.indexOf(filters.year as (typeof years)[number])

  const navList = (onNavigate?: () => void) => {
    let group = ''
    return (
      <nav className="nav" aria-label="Əsas menyu" onPointerLeave={() => setHovered(null)}>
        {navigation.map((item) => {
          const showGroup = item.group !== group
          group = item.group
          const isActive = item.path === active.path
          return (
            <div key={item.path}>
              {showGroup ? <div className="nav-group">{item.group}</div> : null}
              <NavLink
                to={{ pathname: item.path, search: location.search }}
                viewTransition
                onClick={onNavigate}
                onPointerEnter={() => setHovered(item.path)}
                onFocus={() => setHovered(item.path)}
                className={`nav-item press ${isActive ? 'is-active' : ''}`}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                {hovered === item.path && !isActive ? (
                  <motion.span layoutId="nav-hover" className="nav-item__hover" transition={spring} />
                ) : null}
                {isActive ? <motion.span layoutId="nav-lens" className="nav-item__lens" transition={spring} /> : null}
                <span className="nav-item__icon">{item.icon}</span>
                <span className="nav-item__label">{item.label}</span>
              </NavLink>
            </div>
          )
        })}
      </nav>
    )
  }

  return (
    <>
      <AmbientBackdrop />
      <LiquidGlassFilter />

      <div className={`app ${collapsed ? 'is-collapsed' : ''} ${presenting ? 'is-presenting' : ''}`}>
        <LiquidGlass as="aside" chrome refract className="sidebar" aria-label="Kənar menyu">
          <NavLink to={{ pathname: '/', search: location.search }} viewTransition className="sidebar__brand" aria-label="AzərDash ana səhifə">
            <BrandLogo size={40} />
            <span className="sidebar__brand-text">
              <strong>AzərDash</strong>
              <small>Qərar üçün vizual analitika</small>
            </span>
          </NavLink>
          {navList()}
          <div className="sidebar__foot">
            <span className="avatar" aria-hidden>
              Aİ
            </span>
            <span className="sidebar__foot-text">
              <strong>Anar İsmayılzadə</strong>
              <span>UNEC · Data elmləri</span>
            </span>
          </div>
        </LiquidGlass>

        <div className="main">
          <LiquidGlass as="header" chrome refract className={`topbar no-print ${scrolled ? 'is-scrolled' : ''}`}>
            <button
              type="button"
              className="icon-btn press"
              onClick={() => (window.innerWidth <= 1080 ? setMobileOpen(true) : setCollapsed((v) => !v))}
              aria-label="Menyunu aç və ya bağla"
            >
              <span className="hidden max-[1080px]:inline-grid">
                <Menu size={20} />
              </span>
              <span className="inline-grid max-[1080px]:hidden">
                {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
              </span>
            </button>
            <div className="topbar__title">
              <h1>{active.label}</h1>
              <span>{active.description}</span>
            </div>

            <div className="year-stepper flex items-center gap-1 rounded-full p-1" style={{ background: 'var(--bg-hover)' }}>
              <button
                type="button"
                className="icon-btn press"
                style={{ width: 34, height: 34 }}
                onClick={() => filters.stepYear(-1)}
                disabled={yearIdx <= 0}
                aria-label="Əvvəlki il"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="num px-1 text-[15px] font-bold" aria-live="polite">
                {filters.year}
              </span>
              <button
                type="button"
                className="icon-btn press"
                style={{ width: 34, height: 34 }}
                onClick={() => filters.stepYear(1)}
                disabled={yearIdx >= years.length - 1}
                aria-label="Növbəti il"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Select
              value={filters.sector}
              onChange={filters.setSector}
              options={sectorOptions.map((item) => ({ label: item, value: item }))}
              className="sector-select hide-sm"
              popupMatchSelectWidth={false}
              aria-label="Sektor filtri"
            />

            <button type="button" className="pill-btn press hide-sm" onClick={() => setPaletteOpen(true)}>
              <Search size={17} />
              Axtar
              <span className="kbd">⌘K</span>
            </button>
            <button type="button" className="icon-btn press min-[761px]:hidden" onClick={() => setPaletteOpen(true)} aria-label="Axtar">
              <Search size={19} />
            </button>
            <Dropdown menu={exportMenu} trigger={['click']} placement="bottomRight">
              <button type="button" className="icon-btn press" aria-label="Yüklə və paylaş">
                <Download size={19} />
              </button>
            </Dropdown>
            <button type="button" className="icon-btn press hide-sm" onClick={togglePresent} aria-label="Təqdimat rejimi">
              {presenting ? <Shrink size={19} /> : <Expand size={19} />}
            </button>
            <button type="button" className="icon-btn press" onClick={themeFromEvent} aria-label="Temanı dəyiş">
              <motion.span
                key={theme}
                initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={spring}
                className="inline-grid"
              >
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </motion.span>
            </button>
          </LiquidGlass>

          <main key={location.pathname} className="page-stack reveal">
            <Outlet context={filters} />
          </main>

          <LiquidGlass as="footer" className="footer no-print">
            <span>
              <strong className="text-text-primary">AzərDash</strong> · magistr dissertasiyasının praktiki prototipi, UNEC
              2026
            </span>
            <span className="flex flex-wrap gap-4">
              <a href="https://github.com/anarism03/az-biznes-dashboard" target="_blank" rel="noreferrer">
                Mənbə kodu
              </a>
              <a href="mailto:ismayilzadeanar310@gmail.com">ismayilzadeanar310@gmail.com</a>
              <button type="button" className="p-0 border-0 bg-transparent text-inherit cursor-pointer hover:text-az-blue" onClick={() => setHelpOpen(true)}>
                Qısayollar
              </button>
            </span>
          </LiquidGlass>
        </div>
      </div>

      <Drawer
        title={
          <span className="flex items-center gap-3">
            <BrandLogo size={34} />
            <span className="font-bold">AzərDash</span>
          </span>
        }
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        width={300}
      >
        <div className="mb-4">
          <Select
            value={filters.sector}
            onChange={filters.setSector}
            options={sectorOptions.map((item) => ({ label: item, value: item }))}
            className="sector-select w-full"
          />
        </div>
        {navList(() => setMobileOpen(false))}
      </Drawer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />

      <Modal open={helpOpen} onCancel={() => setHelpOpen(false)} footer={null} title="Klaviatura qısayolları" width={460}>
        <table className="data-table">
          <tbody>
            {shortcuts.map(([key, label]) => (
              <tr key={key}>
                <td style={{ width: 150 }}>
                  <span className="kbd">{key}</span>
                </td>
                <td>{label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </>
  )
}
