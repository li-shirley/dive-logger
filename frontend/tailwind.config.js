/** @type {import('tailwindcss').Config} */
export const content = ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    colors: {
      ocean: {
        light: "#a0e7e5",
        mid: "#00bcd4",
        deep: "#007c91",
      },
      sand: {
        light: "#fff8f0",
        mid: "#f0e7e0",
      },
      coral: "#ff5c49",
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
    },
  },
};
export const plugins = [];
