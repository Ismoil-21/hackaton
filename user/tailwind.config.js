/** @type {import('tailwindcss').Config} */
export default {
  // shared/ dagi komponentlar va domain.js dagi ranglar ham skanerlanadi
  content: ['./index.html', './src/**/*.{js,jsx}', '../shared/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: { in: { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'none' } } },
      animation: { in: 'in .18s ease-out' },
    },
  },
  plugins: [],
};
