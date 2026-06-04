import { Navigate, Route, Routes } from 'react-router-dom'
import { App as AntApp, ConfigProvider, theme } from 'antd'
import { DashboardShell } from './components/layout/DashboardShell.jsx'
import { OverviewPage } from './pages/OverviewPage.jsx'
import { KpiFrameworkPage } from './pages/KpiFrameworkPage.jsx'
import { ToolComparisonPage } from './pages/ToolComparisonPage.jsx'
import { EmpiricalStudyPage } from './pages/EmpiricalStudyPage.jsx'
import { GovernancePage } from './pages/GovernancePage.jsx'
import { ReportsPage } from './pages/ReportsPage.jsx'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0f766e',
          colorInfo: '#2563eb',
          colorSuccess: '#16803c',
          colorWarning: '#b45309',
          colorError: '#b42318',
          borderRadius: 8,
          fontFamily: 'Manrope, sans-serif',
        },
        components: {
          Layout: {
            bodyBg: '#f4f1ea',
            siderBg: '#101828',
            headerBg: 'rgba(255,255,255,0.86)',
          },
          Menu: {
            darkItemBg: '#101828',
            darkSubMenuItemBg: '#101828',
            darkItemSelectedBg: '#164e63',
            darkItemHoverBg: '#1f2937',
          },
          Table: {
            headerBg: '#f8fafc',
            rowHoverBg: '#f0fdfa',
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AntApp>
    </ConfigProvider>
  )
}
