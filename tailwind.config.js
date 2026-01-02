/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'adv-success': '#28a745',
        'adv-error': '#dc3545',
        'adv-warning': '#ffc107',
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}