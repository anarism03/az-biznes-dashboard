import { theme as antTheme } from 'antd'
import { useTheme } from '../contexts/ThemeContext'

export function useAppTheme() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const font = "'Onest Variable', 'Segoe UI', system-ui, sans-serif"

  return {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? '#3cc6ec' : '#0094bd',
      colorInfo: isDark ? '#3cc6ec' : '#0094bd',
      colorSuccess: isDark ? '#7ccb5c' : '#3b8a29',
      colorWarning: isDark ? '#f2b33d' : '#b26a00',
      colorError: isDark ? '#ff5a75' : '#d3163a',
      colorTextBase: isDark ? '#e7eff5' : '#0b2131',
      colorBgBase: isDark ? '#051420' : '#e6edf1',
      colorBgContainer: isDark ? '#0e2333' : '#ffffff',
      colorBgElevated: isDark ? '#0e2333' : '#ffffff',
      colorBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(11,33,49,0.12)',
      borderRadius: 14,
      fontFamily: font,
      fontSize: 14,
      motionEaseOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
    components: {
      Select: { optionSelectedBg: isDark ? 'rgba(60,198,236,0.16)' : 'rgba(0,148,189,0.1)' },
      Modal: { borderRadiusLG: 26 },
    },
  }
}
