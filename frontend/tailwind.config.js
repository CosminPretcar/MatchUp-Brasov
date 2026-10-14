/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0f131c",
        surface: "#0f131c",
        "surface-container-lowest": "#0a0e17",
        "surface-container-low": "#181b25",
        "surface-container": "#1c1f29",
        "surface-container-high": "#262a34",
        "surface-container-highest": "#31353f",
        primary: "#4edea3",
        "primary-container": "#10b981",
        "on-primary": "#003824",
        "on-primary-container": "#00422b",
        secondary: "#94de2d",
        "secondary-container": "#7ac100",
        "on-secondary": "#1f3700",
        tertiary: "#7bd0ff",
        "on-tertiary": "#00354a",
        "on-background": "#dfe2ef",
        "on-surface": "#dfe2ef",
        "on-surface-variant": "#bbcabf",
      },
    },
  },
  plugins: [],
}