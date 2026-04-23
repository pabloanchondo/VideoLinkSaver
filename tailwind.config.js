/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'amelia-oblicua-black': ['Amelia-OblicuaBlack', 'sans-serif'],
        'amelia-oblicua-light': ['Amelia-OblicuaLight', 'sans-serif'],
        'montserrat-black': ['Montserrat-Black', 'sans-serif'],
        'montserrat-medium': ['Montserrat-Medium', 'sans-serif']
      }
    },
  },
  plugins: [],
}

