import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F4C5C', // Deep Teal
        secondary: '#C7EDE6', // Light Teal
        accent: '#10B981', // Emerald Green
        burgundy: {
          DEFAULT: '#800020',
          50: '#FDF2F4',
          100: '#FCE6E9',
          200: '#F9CCD3',
          300: '#F5A3B0',
          400: '#F0708D',
          500: '#800020',
          600: '#72001D',
          700: '#64001A',
          800: '#560017',
          900: '#480014',
        },
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        'blue-light': '#EFF6FF',
        'emerald-light': '#ECFDF5',
        'burgundy-light': '#FDF2F4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '10px',
        'lg': '12px',
      },
    },
  },
  plugins: [],
}
export default config

