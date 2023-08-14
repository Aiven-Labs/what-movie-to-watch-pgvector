/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        veryDarkBlue: '#1B262C',
        darkBlue: '#0F4C75',
        lightBlue: '#3282B8',
        veryLightBlue: '#BBE1FA',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      spacing: {

      },
    },
  },
  plugins: [],
}
