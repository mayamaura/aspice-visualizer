/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // セマンティックトークン（テーマに応じてCSS変数で切替）
        bg:              'rgb(var(--color-bg) / <alpha-value>)',
        surface:         'rgb(var(--color-surface) / <alpha-value>)',
        'surface-2':     'rgb(var(--color-surface-2) / <alpha-value>)',
        line:            'rgb(var(--color-line) / <alpha-value>)',
        'line-subtle':   'rgb(var(--color-line-subtle) / <alpha-value>)',
        content:         'rgb(var(--color-content) / <alpha-value>)',
        'content-2':     'rgb(var(--color-content-2) / <alpha-value>)',
        'content-muted': 'rgb(var(--color-content-muted) / <alpha-value>)',
        accent:          'rgb(var(--color-accent) / <alpha-value>)',
        'accent-bg':     'rgb(var(--color-accent-bg) / <alpha-value>)',

        // エンティティアクセント（成果/情報項目/BP）
        outcome:         'rgb(var(--color-outcome) / <alpha-value>)',
        'outcome-bg':    'rgb(var(--color-outcome-bg) / <alpha-value>)',
        item:            'rgb(var(--color-item) / <alpha-value>)',
        'item-bg':       'rgb(var(--color-item-bg) / <alpha-value>)',
        bp:              'rgb(var(--color-bp) / <alpha-value>)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'panel-in': { '0%': { opacity: '0', transform: 'translateX(8px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        'popup-in': { '0%': { opacity: '0', transform: 'scale(0.97)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out',
        'panel-in': 'panel-in 0.16s ease-out',
        'popup-in': 'popup-in 0.14s ease-out',
      },
    },
  },
  plugins: [],
}
