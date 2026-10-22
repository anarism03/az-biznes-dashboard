import { Navigate, Route, Routes } from 'react-router-dom'
import { App as AntApp, ConfigProvider } from 'antd'
import { ThemeProvider } from './contexts/ThemeContext'
import { useAppTheme } from './hooks/useAppTheme'
import { DashboardShell } from './components/layout/DashboardShell'
import { Overview } from './pages/Overview/Overview'
import { KpiFramework } from './pages/KpiFramework/KpiFramework'
import { ToolComparison } from './pages/ToolComparison/ToolComparison'
import { EmpiricalStudy } from './pages/EmpiricalStudy/EmpiricalStudy'
import { Governance } from './pages/Governance/Governance'
import { Reports } from './pages/Reports/Reports'
import { About } from './pages/About/About'

function ThemedApp() {
  const themeConfig = useAppTheme()

  return (
    <ConfigProvider theme={themeConfig}>
      <AntApp>
        <Routes>
          <Route path="/" element={<DashboardShell />}>
            <Route index element={<Overview />} />
            <Route path="kpi-framework" element={<KpiFramework />} />
            <Route path="tools" element={<ToolComparison />} />
            <Route path="empirical-study" element={<EmpiricalStudy />} />
            <Route path="governance" element={<Governance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="about" element={<About />} />
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
