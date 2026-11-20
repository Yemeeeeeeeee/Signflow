/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        ink: 'rgb(var(--foreground) / <alpha-value>)',
        'ink-muted': 'rgb(var(--muted-foreground) / <alpha-value>)',
        line: 'rgb(var(--border) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-fg': 'rgb(var(--primary-foreground) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
      },
      fontSize: {
        micro: ['10px', '1.35'],
        label: ['11px', '1.45'],
        control: ['12px', '1.5'],
      },
    },
  },
  plugins: [],
}
