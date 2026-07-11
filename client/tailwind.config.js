/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        japanese: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        sakura: {
          DEFAULT: '#F4A7BB',
          light: '#FFD4E0',
        },
        indigo: {
          deep: '#1a1a2e',
          mid: '#16213e',
          surface: '#0f3460',
        }
      }
    },
  },
  plugins: [],
}
