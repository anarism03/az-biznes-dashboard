/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'Noto Sans', 'Segoe UI', 'sans-serif'],
        display: ['IBM Plex Sans', 'Noto Sans', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        hover: 'var(--bg-hover)',
        border: 'var(--border)',
        'border-md': 'var(--border-md)',
        'border-strong': 'var(--border-strong)',
        'az-blue': 'var(--az-blue)',
        'az-red': 'var(--az-red)',
        'az-green': 'var(--az-green)',
        teal: 'var(--teal)',
        'teal-d': 'var(--teal-d)',
        cyan: 'var(--cyan)',
        blue: 'var(--blue)',
        amber: 'var(--amber)',
        rose: 'var(--rose)',
        violet: 'var(--violet)',
        green: 'var(--green)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [],
}
