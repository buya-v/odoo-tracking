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
        'adv-warning': '#ffc107',
        'adv-error': '#dc3545',
        'adv-primary': '#71639e',
      },
      spacing: {
        'touch-target': '48px',
      },
    },
  },
  plugins: [],
}