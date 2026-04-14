import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#b8860b",
          "gold-light": "#d4a634",
          "gold-dark": "#8a6508",
          charcoal: "#2d2d2d",
          "charcoal-light": "#4a4a4a",
          rose: "#e8b4b8",
          "rose-light": "#f2d4d7",
          "rose-dark": "#c9888e",
          cream: "#fdf8f0",
          "cream-dark": "#f5edd8",
          white: "#ffffff",
        },
      },
      fontFamily: {
        heebo: ["Heebo", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
