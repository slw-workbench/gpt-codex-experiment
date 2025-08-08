import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EF582C', // TODO: Replace with official Food Promart color
          600: '#D94F27',
          700: '#BF461F',
        },
      },
    },
  },
  plugins: [forms],
}
