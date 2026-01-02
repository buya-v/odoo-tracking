/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        adv: {
          primary: '#714B67',
          success: '#00A09D',
          danger: '#DC3545',
          warning: '#FFBB33',
          surface: '#F8F9FA',
        }
      },
      fontSize: {
        barcode: '1.2rem',
      }
    },
  },
  plugins: [],
}