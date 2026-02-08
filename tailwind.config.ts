import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3B',
        green: { DEFAULT: '#1F8A5B', hover: '#176D48' },
        amber: { DEFAULT: '#F2A900', light: '#FFF4D6' },
        ink: '#111827',
        'warm-white': '#F8FAFC',
        'light-grey': '#EEF2F6',
        'border-grey': '#D7DEE8',
        error: '#B42318',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Source Serif 4', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
