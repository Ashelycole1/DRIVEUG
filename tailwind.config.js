/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fafafa',
        primary: '#111111',
        card: '#ffffff',
        accent: {
          green: '#e8f5ed',
          amber: '#fff8ee'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderColor: {
        DEFAULT: '#e5e7eb',
        150: '#ebebeb',
        250: '#d1d5db',
      }
    },
  },
  plugins: [],
}


