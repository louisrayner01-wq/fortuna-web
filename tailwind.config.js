/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFD700",
          dark:    "#B8860B",
          light:   "#FFE566",
        },
      },
    },
  },
  plugins: [],
}
