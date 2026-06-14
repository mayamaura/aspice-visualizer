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

        // グループトークン（12グループ × 3ロール）
        'grp-sys':  { surface: 'rgb(var(--grp-sys-surface) / <alpha-value>)',  line: 'rgb(var(--grp-sys-line) / <alpha-value>)',  text: 'rgb(var(--grp-sys-text) / <alpha-value>)' },
        'grp-swe':  { surface: 'rgb(var(--grp-swe-surface) / <alpha-value>)',  line: 'rgb(var(--grp-swe-line) / <alpha-value>)',  text: 'rgb(var(--grp-swe-text) / <alpha-value>)' },
        'grp-hwe':  { surface: 'rgb(var(--grp-hwe-surface) / <alpha-value>)',  line: 'rgb(var(--grp-hwe-line) / <alpha-value>)',  text: 'rgb(var(--grp-hwe-text) / <alpha-value>)' },
        'grp-val':  { surface: 'rgb(var(--grp-val-surface) / <alpha-value>)',  line: 'rgb(var(--grp-val-line) / <alpha-value>)',  text: 'rgb(var(--grp-val-text) / <alpha-value>)' },
        'grp-mle':  { surface: 'rgb(var(--grp-mle-surface) / <alpha-value>)',  line: 'rgb(var(--grp-mle-line) / <alpha-value>)',  text: 'rgb(var(--grp-mle-text) / <alpha-value>)' },
        'grp-man':  { surface: 'rgb(var(--grp-man-surface) / <alpha-value>)',  line: 'rgb(var(--grp-man-line) / <alpha-value>)',  text: 'rgb(var(--grp-man-text) / <alpha-value>)' },
        'grp-sup':  { surface: 'rgb(var(--grp-sup-surface) / <alpha-value>)',  line: 'rgb(var(--grp-sup-line) / <alpha-value>)',  text: 'rgb(var(--grp-sup-text) / <alpha-value>)' },
        'grp-pim':  { surface: 'rgb(var(--grp-pim-surface) / <alpha-value>)',  line: 'rgb(var(--grp-pim-line) / <alpha-value>)',  text: 'rgb(var(--grp-pim-text) / <alpha-value>)' },
        'grp-acq':  { surface: 'rgb(var(--grp-acq-surface) / <alpha-value>)',  line: 'rgb(var(--grp-acq-line) / <alpha-value>)',  text: 'rgb(var(--grp-acq-text) / <alpha-value>)' },
        'grp-spl':  { surface: 'rgb(var(--grp-spl-surface) / <alpha-value>)',  line: 'rgb(var(--grp-spl-line) / <alpha-value>)',  text: 'rgb(var(--grp-spl-text) / <alpha-value>)' },
        'grp-reu':  { surface: 'rgb(var(--grp-reu-surface) / <alpha-value>)',  line: 'rgb(var(--grp-reu-line) / <alpha-value>)',  text: 'rgb(var(--grp-reu-text) / <alpha-value>)' },
        'grp-sec':  { surface: 'rgb(var(--grp-sec-surface) / <alpha-value>)',  line: 'rgb(var(--grp-sec-line) / <alpha-value>)',  text: 'rgb(var(--grp-sec-text) / <alpha-value>)' },
      },
    },
  },
  plugins: [],
}
