/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app.js',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media', // or 'class'
  theme: {
    extend: {},
  },
  plugins: [],
};