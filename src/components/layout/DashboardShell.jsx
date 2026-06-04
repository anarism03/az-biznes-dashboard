import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { App as AntApp, Badge, Button, Drawer, Dropdown, Input, Layout, Menu, Modal, Select, Segmented } from 'antd'
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  DatabaseZap,
  Download,
  FileText,
  Gauge,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from 'lucide-react'
import { chapterMap, sectors, sourceLinks, years } from '../../data/dashboardData.js'
import { useDashboardFilters } from '../../hooks/useDashboardFilters.js'
import {
  copySummary,
  exportDashboardCsv,
  exportDashboardExcel,
  exportDashboardJson,
} from '../../utils/exportData.js'

const { Header, Sider, Content } = Layout

const navigation = [
  { key: '/', label: 'İcra paneli', icon: <Gauge size={18} /> },
  { key: '/kpi-framework', label: 'KPI modeli', icon: <Network size={18} /> },
  { key: '/tools', label: 'BI alətləri', icon: <BarChart3 size={18} /> },
  { key: '/empirical-study', label: 'Empirik analiz', icon: <BrainCircuit size={18} /> },
  { key: '/governance', label: 'Data governance', icon: <DatabaseZap size={18} /> },
  { key: '/reports', label: 'Hesabat və mənbələr', icon: <FileText size={18} /> },
]

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

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
  const isCompact = useMediaQuery('(max-width: 980px)')

  const selectedKey = useMemo(() => {
    const match = navigation.find((item) => item.key !== '/' && location.pathname.startsWith(item.key))
    return match?.key || '/'
  }, [location.pathname])

  const activeTitle = navigation.find((item) => item.key === selectedKey)?.label || 'İcra paneli'

  const searchIndex = useMemo(() => {
    const pageItems = navigation.map((item) => ({
      title: item.label,
      route: item.key,
      text: `${item.label} dashboard KPI data vizuallaşdırma biznes analiz`,
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

  const handleNavigate = (key) => {
    navigate(key)
    setMobileNavOpen(false)
  }

  const handleExport = async (type) => {
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
      { type: 'divider' },
      { key: 'copy', label: 'Qısa nəticəni kopyala' },
    ],
    onClick: ({ key }) => handleExport(key),
  }

  return (
    <Layout className="app-shell">
      {!isCompact && (
        <Sider width={292} collapsedWidth={86} collapsed={collapsed} className="app-sider">
          <Link to="/" className="brand-lockup" aria-label="Ana səhifə">
            <div className="brand-mark">
              <BookOpenCheck size={22} />
            </div>
            {!collapsed && (
              <div>
                <span>Vizual BI Lab</span>
                <small>Dissertasiya dashboardu</small>
              </div>
            )}
          </Link>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => handleNavigate(key)}
          />

          <div className="sider-status">
            <Badge status="processing" color="#2dd4bf" />
            {!collapsed && (
              <div>
                <strong>Filtrli panel</strong>
                <span>Filtr dəyişəndə panel yenilənir</span>
              </div>
            )}
          </div>
        </Sider>
      )}

      <Layout>
        <Header className="app-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
              onClick={() => (isCompact ? setMobileNavOpen(true) : setCollapsed((value) => !value))}
              aria-label="Menyunu dəyiş"
            />
            <div>
              <h1>{activeTitle}</h1>
              <p>Biznes datasının vizual analizi və qərar paneli</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="live-pill" type="button" onClick={() => message.info('Panel yalnız seçilən filtrə görə yenilənir')}>
              <Badge status="processing" color="#0f766e" />
              <span>Filtr aktiv</span>
            </button>
            <Button icon={<Search size={17} />} onClick={() => setSearchOpen(true)}>Axtarış</Button>
            <Dropdown menu={exportMenu} trigger={['click']}>
              <Button icon={<Download size={17} />}>Yüklə</Button>
            </Dropdown>
            <Segmented
              value={filters.year}
              onChange={filters.setYear}
              options={years}
              className="year-switch"
            />
            <Select
              value={filters.sector}
              onChange={filters.setSector}
              options={sectors.map((item) => ({ label: item, value: item }))}
              className="sector-select"
            />
          </div>
        </Header>

        <Content className="app-content">
          <Outlet context={filters} />
        </Content>
      </Layout>

      <Drawer
        title="Vizual BI Lab"
        placement="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        size="default"
        className="mobile-nav-drawer"
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => handleNavigate(key)}
        />
      </Drawer>

      <Modal
        title="Dashboard axtarışı"
        open={searchOpen}
        onCancel={() => setSearchOpen(false)}
        footer={null}
        width={680}
      >
        <Input
          size="large"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          prefix={<Search size={18} />}
          placeholder="KPI, governance, Power BI, Fəsil III..."
          autoFocus
        />
        <div className="search-result-list">
          {results.length ? (
            results.map((item) => (
              <button
                key={`${item.route}-${item.title}`}
                type="button"
                onClick={() => {
                  navigate(item.route)
                  setSearchOpen(false)
                  setQuery('')
                }}
              >
                <strong>{item.title}</strong>
                <span>{item.text}</span>
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
