/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './**/*.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#022c20',
          primary: '#033f2e',
          medium: '#0a5c45',
          accent: '#d4af37',
          goldLight: '#f4e8c1',
          cream: '#fbfbf8'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        arabic: ['Amiri', 'serif']
      }
    }
  },
  plugins: []
};
