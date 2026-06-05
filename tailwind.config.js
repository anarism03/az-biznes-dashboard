/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        hover: 'var(--bg-hover)',
        border: 'var(--border)',
        'border-md': 'var(--border-md)',
        'border-strong': 'var(--border-strong)',
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
        'glow-teal': 'var(--shadow-glow-teal)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
        'glow-violet': 'var(--shadow-glow-violet)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
}
