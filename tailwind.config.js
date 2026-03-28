/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0d1117',
          800: '#161b22',
          700: '#1c2128',
          600: '#21262d',
          500: '#30363d',
        }
      }
    },
  },
  plugins: [],
}
