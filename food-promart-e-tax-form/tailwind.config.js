import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F9D8A', // TODO: Replace with official Food Promart color
          600: '#0B7C6C',
          700: '#08635A',
        },
      },
    },
  },
  plugins: [forms],
}
