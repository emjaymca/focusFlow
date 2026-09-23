/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7D1A', // vibrant orange
          dark: '#D65A00',
          light: '#FFE5D0',
        },
        accent: {
          DEFAULT: '#4CAF50', // fresh green
          dark: '#357A38',
          light: '#E6F4EA',
        },
        background: {
          DEFAULT: '#FFF8F3', // soft off-white
          dark: '#F5F5F5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#F3F4F6',
        },
        muted: {
          DEFAULT: '#F3F4F6',
          dark: '#E5E7EB',
        },
        text: {
          DEFAULT: '#22223B',
          light: '#6B7280',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
