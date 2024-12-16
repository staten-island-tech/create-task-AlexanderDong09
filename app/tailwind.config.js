/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/main.js", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      purple: "rgba(87,75,167, 0.65)",
      lightblue: "#717fe1",
      cream: "#fffce9",
      black: "#020001",
      green: "#1a6970",
    },
  },
  extend: {},

  plugins: [require("daisyui")],
};
