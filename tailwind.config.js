/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./resources/**/*.{edge,js,ts,jsx,tsx}'],
  plugins: [require('@tailwindcss/forms')],
}
