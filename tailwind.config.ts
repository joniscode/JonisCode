/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    'src/app/**/*.{js,ts,jsx,tsx}',
    'src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#040D21',
          800: '#061833',
          700: '#0B2A5A',
          500: '#5A688E',
        },
        accent: {
          400: '#13B0F5',
          500: '#2F80ED',
        },
        'text-secondary': '#94A3B8',
        callout: '#FF7754',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #13B0F5 0%, #2F80ED 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
