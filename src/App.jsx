import { Navigate, Route, Routes } from 'react-router-dom'
import { App as AntApp, ConfigProvider, theme as antTheme } from 'antd'
import { ThemeProvider, useTheme } from './contexts/ThemeContext.jsx'
import { DashboardShell } from './components/layout/DashboardShell.jsx'
import { OverviewPage } from './pages/OverviewPage.jsx'
import { KpiFrameworkPage } from './pages/KpiFrameworkPage.jsx'
import { ToolComparisonPage } from './pages/ToolComparisonPage.jsx'
import { EmpiricalStudyPage } from './pages/EmpiricalStudyPage.jsx'
import { GovernancePage } from './pages/GovernancePage.jsx'
import { ReportsPage } from './pages/ReportsPage.jsx'
import { AboutPage } from './pages/AboutPage.jsx'

function ThemedApp() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary:     isDark ? '#14b8a6' : '#0f766e',
          colorInfo:        isDark ? '#0ea5e9' : '#2563eb',
          colorSuccess:     isDark ? '#10b981' : '#15803d',
          colorWarning:     isDark ? '#f59e0b' : '#b45309',
          colorError:       isDark ? '#f43f5e' : '#be123c',
          borderRadius:     10,
          fontFamily:       'Inter, sans-serif',
          colorBgBase:      isDark ? '#080C14'  : '#f4f1ea',
          colorTextBase:    isDark ? '#f1f5f9'  : '#101828',
          colorBgContainer: isDark ? '#111827'  : '#fffdf8',
          colorBgElevated:  isDark ? '#111827'  : '#ffffff',
          colorBorder:      isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16,24,40,0.08)',
        },
        components: {
          Layout: {
            bodyBg:   isDark ? '#080C14' : '#f4f1ea',
            siderBg:  isDark ? '#0D1220' : '#ffffff',
            headerBg: isDark ? 'rgba(8,12,20,0.85)' : 'rgba(255,255,255,0.92)',
          },
          Menu: {
            // Dark mode
            darkItemBg:            'transparent',
            darkSubMenuItemBg:      'transparent',
            darkItemSelectedBg:     'rgba(20,184,166,0.12)',
            darkItemHoverBg:        'rgba(255,255,255,0.06)',
            darkItemColor:          '#94a3b8',
            darkItemSelectedColor:  '#14b8a6',
            // Light mode
            itemBg:                 'transparent',
            itemSelectedBg:         'rgba(15,118,110,0.08)',
            itemHoverBg:            'rgba(15,118,110,0.05)',
            itemColor:              '#475569',
            itemSelectedColor:      '#0f766e',
          },
          Table: {
            headerBg:    isDark ? 'rgba(255,255,255,0.04)' : 'rgba(16,24,40,0.03)',
            rowHoverBg:  isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,118,110,0.04)',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16,24,40,0.08)',
          },
          Card: {
            colorBgContainer:    isDark ? '#111827' : '#fffdf8',
            colorBorderSecondary: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(16,24,40,0.08)',
          },
        },
      }}
    >
      <AntApp>
        <Routes>
          <Route path="/" element={<DashboardShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="kpi-framework" element={<KpiFrameworkPage />} />
            <Route path="tools" element={<ToolComparisonPage />} />
            <Route path="empirical-study" element={<EmpiricalStudyPage />} />
            <Route path="governance" element={<GovernancePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AntApp>
    </ConfigProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  )
}
