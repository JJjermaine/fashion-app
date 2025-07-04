/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  safelist: [
    // Add all the gradient combinations you might use
    'from-beige-100',
    'from-beige-200',
    'to-beige-300',
    'to-beige-400',
    'to-amber-200',
    'to-amber-300',
    // Hover states
    'hover:from-beige-300',
    'hover:to-beige-400',
    'hover:from-beige-200',
    'hover:to-amber-300',
    // Faded backgrounds
    'bg-beige-100/20',
    'bg-beige-200/20',
    'bg-beige-300/20',
    'bg-beige-400/20',
    'from-beige-100/20',
    'from-beige-200/20',
    'to-beige-200/20',
    'to-beige-300/20',
    'hover:bg-beige-100/30',
    'hover:bg-beige-200/30',
    'hover:from-beige-200/30',
    'hover:to-beige-300/30',
  ],

  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: '#f5f5dc',
          50: '#fdfcf6',
          100: '#f8f6e7',
          200: '#f5f5dc',
          300: '#ece5c7',
          400: '#e1d8b7',
          500: '#d6cba7',
          600: '#bfae8a',
          700: '#a7926e',
          800: '#8f7652',
          900: '#776a4a',
        },
      },
    },
  },
  plugins: [],
}
