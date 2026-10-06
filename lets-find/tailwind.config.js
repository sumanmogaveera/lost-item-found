/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pjs)', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f1f8f5',
          100: '#dcece5',
          200: '#bcd9cf',
          300: '#8fbcaf',
          400: '#5e998a',
          500: '#3d7a6a',
          600: '#2d6154',
          700: '#254e44',
          800: '#204037',
          900: '#1c362f',
          950: '#101f1b',
        },
      },
    },
  },
  plugins: [],
};
