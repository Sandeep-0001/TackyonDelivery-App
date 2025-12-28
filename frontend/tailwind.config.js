/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: colors.sky,
          accent: colors.violet,
          highlight: colors.emerald,
        },
      },
    },
  },
  plugins: [],
};
