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

          width: {
          '100': '58rem',
        }
    },
  },
  plugins: [],
}

