import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { App as AntApp, Button, Drawer, Dropdown, Input, Layout, Menu, Modal, Select, Segmented } from 'antd'
import {
  BarChart3,
  BrainCircuit,
  DatabaseZap,
  Download,
  FileText,
  Flame,
  Gauge,
  Info,
  Moon,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from 'lucide-react'
import { chapterMap, sectors, sourceLinks, years } from '../../data/dashboardData'
import { useDashboardFilters } from '../../hooks/useDashboardFilters'
import { useTheme } from '../../contexts/ThemeContext'
import {
  copySummary,
  exportDashboardCsv,
  exportDashboardExcel,
  exportDashboardJson,
} from '../../utils/exportData'

const { Header, Sider, Content, Footer } = Layout

const navigation = [
  { key: '/', label: 'İcra paneli', icon: <Gauge size={18} /> },
  { key: '/kpi-framework', label: 'KPI modeli', icon: <Network size={18} /> },
  { key: '/tools', label: 'BI alətləri', icon: <BarChart3 size={18} /> },
  { key: '/empirical-study', label: 'Empirik analiz', icon: <BrainCircuit size={18} /> },
  { key: '/governance', label: 'Data governance', icon: <DatabaseZap size={18} /> },
  { key: '/reports', label: 'Hesabat və mənbələr', icon: <FileText size={18} /> },
  { key: '/about', label: 'Haqqımızda', icon: <Info size={18} /> },
]

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = () => setMatches(media.matches)
    listener()
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

export function DashboardShell() {
  const { message } = AntApp.useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const filters = useDashboardFilters()
  const { theme, toggleTheme } = useTheme()
  const isCompact = useMediaQuery('(max-width: 980px)')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const selectedKey = useMemo(() => {
    const match = navigation.find((item) => item.key !== '/' && location.pathname.startsWith(item.key))
    return match?.key || '/'
  }, [location.pathname])

  const activeTitle = navigation.find((item) => item.key === selectedKey)?.label || 'İcra paneli'

  const searchIndex = useMemo(() => {
    const pageDescriptions: Record<string, string> = {
      '/': 'Əsas icra və performans paneli',
      '/kpi-framework': 'Biznes modelləri və KPI arxitekturası',
      '/tools': 'Müxtəlif analitik platformaların texniki müqayisəsi',
      '/empirical-study': 'Biznes göstəricilərinin empirik analizi',
      '/governance': 'Data idarəetməsi, ETL və semantik model',
      '/reports': 'Mənbələr, hesabatlar və metodologiya',
      '/about': 'Platforma və məqsədimiz haqqında məlumat',
    }

    const pageItems = navigation.map((item) => ({
      title: item.label,
      route: item.key,
      text: pageDescriptions[item.key] || `${item.label} modulu`,
    }))
    const chapterItems = chapterMap.map((chapter) => ({
      title: chapter.subtitle,
      route: '/reports',
      text: `${chapter.title} ${chapter.subtitle} ${chapter.points.join(' ')}`,
    }))
    const sourceItems = sourceLinks.map((source) => ({
      title: source.name,
      route: '/reports',
      text: source.detail,
    }))
    return [...pageItems, ...chapterItems, ...sourceItems]
  }, [])

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('az-AZ')
    if (!normalized) return searchIndex.slice(0, 6)
    return searchIndex
      .filter((item) => `${item.title} ${item.text}`.toLocaleLowerCase('az-AZ').includes(normalized))
      .slice(0, 8)
  }, [query, searchIndex])

  const handleNavigate = (key: string) => {
    navigate(key)
    setMobileNavOpen(false)
  }

  const handleExport = async (type: string) => {
    if (type === 'excel') {
      exportDashboardExcel(filters)
      message.success('Excel faylı endirildi')
    }
    if (type === 'csv') {
      exportDashboardCsv(filters)
      message.success('CSV faylı endirildi')
    }
    if (type === 'json') {
      exportDashboardJson(filters)
      message.success('JSON faylı endirildi')
    }
    if (type === 'copy') {
      await copySummary(filters)
      message.success('Qısa nəticə clipboard-a kopyalandı')
    }
  }

  const menuItems = navigation.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }))

  const exportMenu = {
    items: [
      { key: 'excel', label: 'Excel (.xls)' },
      { key: 'csv', label: 'CSV' },
      { key: 'json', label: 'JSON' },
      { type: 'divider' as const },
      { key: 'copy', label: 'Qısa nəticəni kopyala' },
    ],
    onClick: ({ key }: { key: string }) => handleExport(key),
  }

  return (
    <Layout hasSider={!isCompact} className="min-h-screen bg-base text-text-primary transition-colors duration-250">
      {!isCompact && (
        <Sider
          width={292}
          collapsedWidth={86}
          collapsed={collapsed}
          className="border-r border-border bg-surface !border-r-border !bg-surface sticky top-0 h-screen overflow-y-auto"
        >
          <Link
            to="/"
            className="flex items-center justify-center pt-5 pb-4 border-b border-border decoration-none transition-colors duration-250 overflow-hidden"
            aria-label="Ana səhifə"
          >
            <div className="brand-badge">
              <Flame size={22} />
            </div>
            <div
              className={`overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap ${
                collapsed ? 'w-0 opacity-0 ml-0' : 'w-[150px] opacity-100 ml-3'
              }`}
            >
              <span className="block text-base font-extrabold text-text-primary leading-tight font-display">
                AzərDash
              </span>
              <small className="block text-[11px] font-medium text-text-secondary leading-tight mt-0.5">
                Biznes Analitika
              </small>
            </div>
          </Link>

          <Menu
            mode="inline"
            theme={theme === 'dark' ? 'dark' : 'light'}
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => handleNavigate(String(key))}
            className="border-none bg-transparent px-2 mt-2"
          />
        </Sider>
      )}

      <Layout className="min-w-0">
        <Header className="flex flex-col md:flex-row md:items-center justify-between px-0 md:px-6 py-3 md:py-0 gap-3 border-b border-border backdrop-blur-md sticky top-0 z-[100] bg-surface shadow-sm transition-all duration-250 h-auto min-h-[64px] !leading-normal !bg-surface/85 w-full max-w-full">
          <div className="flex items-center justify-between w-full md:w-auto px-4 md:px-0">
            <div className="flex items-center gap-2">
              <Button
                type="text"
                icon={collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                onClick={() => (isCompact ? setMobileNavOpen(true) : setCollapsed((value) => !value))}
                aria-label="Menyunu dəyiş"
                className="text-text-primary flex items-center justify-center hover:bg-hover !text-text-primary !px-2 !-ml-2"
              />
              <div>
                <h2 className="text-[17px] font-bold text-text-primary m-0 font-display line-clamp-1">
                  {activeTitle}
                </h2>
                {!isCompact && (
                  <p className="text-xs text-text-secondary m-0">Biznes idarəetmə paneli</p>
                )}
              </div>
            </div>

            {isCompact && (
              <div className="flex items-center gap-1">
                <Button
                  type="text"
                  icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  onClick={toggleTheme}
                  className="!text-text-secondary hover:!text-teal"
                />
                <Button
                  type="text"
                  icon={<Search size={18} />}
                  onClick={() => setSearchOpen(true)}
                  className="!text-text-secondary hover:!text-teal"
                />
                <Dropdown menu={exportMenu} trigger={['click']}>
                  <Button type="text" icon={<Download size={18} />} className="!text-text-secondary hover:!text-teal" />
                </Dropdown>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-3 ${isCompact ? 'w-full overflow-x-auto no-scrollbar px-4 pb-1' : ''}`}>
            {!isCompact && (
              <div className="flex items-center gap-2 mr-2">
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-border-md bg-card text-text-secondary cursor-pointer transition-all duration-200 hover:bg-hover hover:text-teal hover:border-teal"
                  onClick={toggleTheme}
                  aria-label="Temanı dəyiş"
                  type="button"
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <Button icon={<Search size={17} />} onClick={() => setSearchOpen(true)}>
                  Axtarış
                </Button>
                <Dropdown menu={exportMenu} trigger={['click']}>
                  <Button icon={<Download size={17} />}>Yüklə</Button>
                </Dropdown>
              </div>
            )}

            <Segmented
              value={filters.year}
              onChange={(value) => filters.setYear(String(value))}
              options={[...years]}
              className="year-switch shrink-0"
              size={isCompact ? 'small' : 'middle'}
            />
            <Select
              value={filters.sector}
              onChange={filters.setSector}
              options={sectors.map((item) => ({ label: item, value: item }))}
              className="sector-select shrink-0 min-w-[130px]"
              size={isCompact ? 'small' : 'middle'}
              popupMatchSelectWidth={false}
            />
          </div>
        </Header>

        <Content className="p-4 md:p-6 max-w-[1440px] mx-auto w-full transition-colors duration-250 overflow-hidden">
          <Outlet context={filters} />
        </Content>

        <Footer className="text-center bg-surface border-t border-border px-6 py-6 transition-colors duration-250">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1440px] mx-auto text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary font-display">AzərDash</span> ©{' '}
              {new Date().getFullYear()}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link to="/about" className="hover:text-teal transition-colors">
                Haqqımızda
              </Link>
              <Link to="/reports" className="hover:text-teal transition-colors">
                Hesabat və mənbələr
              </Link>
              <a href="mailto:ismayilzadeanar310@gmail.com" className="hover:text-teal transition-colors">
                ismayilzadeanar310@gmail.com
              </a>
              <a href="tel:+994504496536" className="hover:text-teal transition-colors">
                +994 50 449 65 36
              </a>
              <a
                href="https://linkedin.com/in/anarismayilzada"
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </Footer>
      </Layout>

      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="brand-badge brand-badge--sm">
              <Flame size={18} />
            </div>
            <span className="text-base font-extrabold text-text-primary font-display">AzərDash</span>
          </div>
        }
        placement="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        size="default"
        className="mobile-nav-drawer"
      >
        <Menu
          mode="inline"
          theme={theme === 'dark' ? 'dark' : 'light'}
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => handleNavigate(String(key))}
        />
      </Drawer>

      <Modal title="Dashboard axtarışı" open={searchOpen} onCancel={() => setSearchOpen(false)} footer={null} width={680}>
        <Input
          size="large"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          prefix={<Search size={18} />}
          placeholder="Məsələn: KPI, governance, Power BI, gəlir..."
          autoFocus
        />
        <div className="search-result-list">
          {results.length ? (
            results.map((item) => (
              <button
                key={`${item.route}-${item.title}`}
                type="button"
                className="w-full text-left p-3 mb-2 rounded-xl border border-border bg-base hover:bg-hover hover:border-teal transition-all duration-200 cursor-pointer flex flex-col group"
                onClick={() => {
                  navigate(item.route)
                  setSearchOpen(false)
                  setQuery('')
                }}
              >
                <strong className="text-sm text-text-primary group-hover:text-teal transition-colors block">
                  {item.title}
                </strong>
                <span className="text-xs text-text-secondary mt-1 block">{item.text}</span>
              </button>
            ))
          ) : (
            <div className="empty-search">Nəticə tapılmadı. Başqa açar söz yazın.</div>
          )}
        </div>
      </Modal>
    </Layout>
  )
}
