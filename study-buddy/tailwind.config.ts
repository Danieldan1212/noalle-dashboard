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
        primary: {
          50: "#e8eef5",
          100: "#c5d5e8",
          200: "#9fb9d9",
          300: "#789dca",
          400: "#5b88be",
          500: "#3e73b2",
          600: "#1e3a5f",
          700: "#1a3254",
          800: "#152a48",
          900: "#0f1f35",
        },
        accent: {
          50: "#fff8eb",
          100: "#feecc7",
          200: "#fdd889",
          300: "#fcc44b",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
          800: "#783610",
          900: "#642e0e",
        },
        cream: {
          50: "#fdfcfa",
          100: "#faf7f2",
          200: "#f5f0e8",
          300: "#efe8db",
          400: "#e8dfce",
          500: "#ddd2bc",
        },
      },
      fontFamily: {
        heebo: ["Heebo", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
