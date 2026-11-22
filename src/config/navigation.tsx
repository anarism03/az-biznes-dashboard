import { BarChart3, BookOpen, ClipboardList, DatabaseZap, FileText, Gauge, Network } from 'lucide-react'
import type { ReactNode } from 'react'

export interface NavItem {
  path: string
  label: string
  description: string
  icon: ReactNode
  group: 'Panel' | 'Tədqiqat' | 'Mənbələr'
}

export const navigation: NavItem[] = [
  {
    path: '/',
    label: 'İcra paneli',
    description: 'Rəsmi makro göstəricilər, sektor payları və Dünya Bankı trendi',
    icon: <Gauge size={19} />,
    group: 'Panel',
  },
  {
    path: '/empirical-study',
    label: 'Sorğu nəticələri',
    description: '26.10.2026 sorğusu: 29 uyğun cavabın təsviri təhlili',
    icon: <ClipboardList size={19} />,
    group: 'Tədqiqat',
  },
  {
    path: '/kpi-framework',
    label: 'KPI modeli',
    description: 'BSC perspektivləri, KPI lüğəti və vizual kodlaşdırma',
    icon: <Network size={19} />,
    group: 'Tədqiqat',
  },
  {
    path: '/tools',
    label: 'BI alətləri',
    description: 'Tableau, Power BI, Looker, D3.js və Vega-Lite müqayisəsi',
    icon: <BarChart3 size={19} />,
    group: 'Tədqiqat',
  },
  {
    path: '/governance',
    label: 'Məlumat idarəetməsi',
    description: 'Mənbədən qərara qədər məlumat xətti və keyfiyyət qaydaları',
    icon: <DatabaseZap size={19} />,
    group: 'Tədqiqat',
  },
  {
    path: '/reports',
    label: 'Hesabat və mənbələr',
    description: 'Fəsillər, təkliflər və istifadə olunan rəsmi mənbələr',
    icon: <FileText size={19} />,
    group: 'Mənbələr',
  },
  {
    path: '/about',
    label: 'Layihə haqqında',
    description: 'AzərDash prototipi, müəllif və texnologiyalar',
    icon: <BookOpen size={19} />,
    group: 'Mənbələr',
  },
]

export function findNav(pathname: string) {
  return navigation.find((item) => item.path !== '/' && pathname.startsWith(item.path)) ?? navigation[0]
}
