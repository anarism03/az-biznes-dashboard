import { theme as antTheme } from 'antd'
import { useTheme } from '../contexts/ThemeContext'

export function useAppTheme() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return {
    algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: isDark ? '#2dd4bf' : '#0a6e6a',
      colorInfo: isDark ? '#38bdf8' : '#1d4ed8',
      colorSuccess: isDark ? '#34d399' : '#15803d',
      colorWarning: isDark ? '#fbbf24' : '#b45309',
      colorError: isDark ? '#fb7185' : '#be123c',
      borderRadius: 12,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      colorBgBase: isDark ? '#0b1220' : '#eef2f6',
      colorTextBase: isDark ? '#e8eef6' : '#0f172a',
      colorBgContainer: isDark ? '#121a2b' : '#ffffff',
      colorBgElevated: isDark ? '#162033' : '#ffffff',
      colorBorder: isDark ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.08)',
    },
    components: {
      Layout: {
        bodyBg: isDark ? '#0b1220' : '#eef2f6',
        siderBg: isDark ? '#0f172a' : '#ffffff',
        headerBg: isDark ? 'rgba(11,18,32,0.88)' : 'rgba(255,255,255,0.92)',
      },
      Menu: {
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
        darkItemSelectedBg: 'rgba(45,212,191,0.12)',
        darkItemHoverBg: 'rgba(255,255,255,0.05)',
        darkItemColor: '#94a3b8',
        darkItemSelectedColor: '#2dd4bf',
        itemBg: 'transparent',
        itemSelectedBg: 'rgba(10,110,106,0.1)',
        itemHoverBg: 'rgba(10,110,106,0.06)',
        itemColor: '#475569',
        itemSelectedColor: '#0a6e6a',
      },
      Table: {
        headerBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
        rowHoverBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(10,110,106,0.05)',
        borderColor: isDark ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.08)',
      },
      Card: {
        colorBgContainer: isDark ? '#121a2b' : '#ffffff',
        colorBorderSecondary: isDark ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.08)',
      },
    },
  }
}
