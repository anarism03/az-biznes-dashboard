import { Navigate, Route, Routes } from 'react-router-dom'
import { App as AntApp, ConfigProvider } from 'antd'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { useAppTheme } from './hooks/useAppTheme.js'
import { DashboardShell } from './components/layout/DashboardShell.jsx'
import { Overview } from './pages/Overview/Overview.jsx'
import { KpiFramework } from './pages/KpiFramework/KpiFramework.jsx'
import { ToolComparison } from './pages/ToolComparison/ToolComparison.jsx'
import { EmpiricalStudy } from './pages/EmpiricalStudy/EmpiricalStudy.jsx'
import { Governance } from './pages/Governance/Governance.jsx'
import { Reports } from './pages/Reports/Reports.jsx'
import { About } from './pages/About/About.jsx'

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
