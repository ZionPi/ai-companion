/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '150': '150px',
        '200': '200px',
        '250': '250px',
        '300': '300px',
      },
      minHeight: {
        '250': '250px',
      },

      width: {
        '100': '58rem',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        hidden: 'hidden',
      },

    },
  },
  variants: {
    extend: {
      backfaceVisibility: ['hover', 'focus'],
    },
  },
  plugins: [],
}

