/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // ProcessCard の hover:${groupMeta.color/borderColor/textColor} は動的クラスのため明示生成
    { pattern: /^bg-(blue|violet|cyan|lime|purple|amber|green|yellow|orange|rose|teal|red)-900$/, variants: ['hover'] },
    { pattern: /^border-(blue|violet|cyan|lime|purple|amber|green|yellow|orange|rose|teal|red)-600$/, variants: ['hover'] },
    { pattern: /^text-(blue|violet|cyan|lime|purple|amber|green|yellow|orange|rose|teal|red)-200$/, variants: ['hover'] },
    // ring-offset-gray-950 (ProcessCard 選択/ハイライト)
    'ring-offset-gray-950',
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


      },
    },
  },
  plugins: [],
}
