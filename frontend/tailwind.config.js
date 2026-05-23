/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: '#291C0E',
        terracotta: '#6E4738',
        sand: '#A78D78',
        cream: '#E1D4C2',
        // Redesign colors
        'v-bg': '#E7DCCB',
        'v-bg-sec': '#EFE4D6',
        'v-card': '#F5EFE6',
        'v-navbar': '#E9DDCD',
        'v-brown-dark': '#6B3E2E',
        'v-brown-med': '#8B5A3C',
        'v-brown-hover': '#7A4B39',
        'v-text-prim': '#2D1F18',
        'v-text-sec': '#5C4A42',
        'v-text-muted': '#8A7B70',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
