import { theme as antTheme } from 'antd'
import { useTheme } from '../contexts/ThemeContext'

export function useAppTheme() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? '#33c4ea' : '#00b5e2',
      colorInfo: isDark ? '#33c4ea' : '#00b5e2',
      colorSuccess: isDark ? '#6dbf4a' : '#509e2f',
      colorWarning: isDark ? '#fbbf24' : '#b45309',
      colorError: isDark ? '#ff4d6a' : '#e4002b',
      borderRadius: 8,
      fontFamily: "'IBM Plex Sans', 'Noto Sans', 'Segoe UI', sans-serif",
      colorBgBase: isDark ? '#0b1220' : '#f5f7fa',
      colorTextBase: isDark ? '#e8eef6' : '#0f172a',
      colorBgContainer: isDark ? '#151e2e' : '#ffffff',
      colorBgElevated: isDark ? '#151e2e' : '#ffffff',
      colorBorder: isDark ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.1)',
    },
    components: {
      Layout: {
        bodyBg: isDark ? '#0b1220' : '#f5f7fa',
        siderBg: isDark ? '#111827' : '#ffffff',
        headerBg: isDark ? 'rgba(17,24,39,0.92)' : 'rgba(255,255,255,0.95)',
      },
      Menu: {
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
        darkItemSelectedBg: 'rgba(51,196,234,0.14)',
        darkItemHoverBg: 'rgba(255,255,255,0.05)',
        darkItemColor: '#94a3b8',
        darkItemSelectedColor: '#33c4ea',
        itemBg: 'transparent',
        itemSelectedBg: 'rgba(0,181,226,0.1)',
        itemHoverBg: 'rgba(0,181,226,0.06)',
        itemColor: '#475569',
        itemSelectedColor: '#007a99',
      },
      Table: {
        headerBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
        rowHoverBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,181,226,0.05)',
        borderColor: isDark ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.1)',
      },
      Card: {
        colorBgContainer: isDark ? '#151e2e' : '#ffffff',
        colorBorderSecondary: isDark ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.1)',
      },
    },
  }
}
