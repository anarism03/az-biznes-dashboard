/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  corePlugins: { preflight: false },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Onest Variable', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Onest Variable', 'Segoe UI', 'system-ui', 'sans-serif'],
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
        amber: 'var(--amber)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
      },
    },
  },
  plugins: [],
}
