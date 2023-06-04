/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./resources/**/*.{edge,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        slideX: {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
      },
      animation: {
        slide: 'slideX 20s cubic-bezier(0, .4, 1, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
