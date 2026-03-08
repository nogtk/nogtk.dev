/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.tsx', './pages/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#FAFAFA',
        'accent-2': '#EAEAEA',
        'accent-7': '#333',
        success: '#0070f3',
        cyan: '#79FFE1',
        // Solarized Light palette
        'sol-base3':  '#fdf6e3',
        'sol-base2':  '#eee8d5',
        'sol-base1':  '#93a1a1',
        'sol-base0':  '#839496',
        'sol-base00': '#657b83',
        'sol-base01': '#586e75',
        'sol-base02': '#073642',
        'sol-blue':   '#268bd2',
        'sol-cyan':   '#2aa198',
        'sol-green':  '#859900',
        'sol-yellow': '#b58900',
        'sol-orange': '#cb4b16',
        'sol-red':    '#dc322f',
        'sol-magenta':'#d33682',
      },
      spacing: {
        28: '7rem',
      },
      letterSpacing: {
        tighter: '-.04em',
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
      boxShadow: {
        sm: '0 5px 10px rgba(0, 0, 0, 0.12)',
        md: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
