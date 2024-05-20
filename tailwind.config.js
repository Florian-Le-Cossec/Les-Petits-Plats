/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        yellow: '#FFD15B',
        dark: '#1B1B1B',
        grey: '#7A7A7A',
        'light-grey': '#C6C6C6'
      },
      fontFamily: {
        'sans': ['"Manrope", sans-serif'],
        'title': ['"Anton"']
      },
    },
  },
  plugins: [],
}

