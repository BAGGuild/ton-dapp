const {heroui} = require("@heroui/theme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E88E5",
        secondary: "#E91E63",
        background: "#121212",
        text: "#ffffff", 
      },
      boxShadow: {
        "lg": "10px 13px 20px -3px rgba(255, 255, 255, 0.1), 0 4px 10px -4px rgba(255, 255, 255, 0.1)",
        "md": "5px 5px 5px -3px rgba(200, 200, 200, 0.1), 4px 4px 5px -2px rgba(200, 200, 200, 0.1)",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};