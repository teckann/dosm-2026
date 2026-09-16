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
        ocean: {
          950: "#081d33", // Deepest abyss background
          900: "#0c2844", // Page container background
          850: "#0e3153", // Card surface
          800: "#123c64", // Elevated card surface
          750: "#164775", // Card hover
          700: "#1a548a", // Border stroke
          600: "#226aa8",
          500: "#38bdf8", // Primary cyan
          400: "#7dd3fc", // Muted cyan
          300: "#bae6fd", // Text light cyan
          200: "#e0f2fe",
          100: "#f0f9ff",
        },
        marine: {
          cyan: "#00d2ff",
          aqua: "#00f2fe",
          teal: "#06b6d4",
          emerald: "#10b981",
          seafoam: "#2dd4bf",
          navy: "#0a192f",
        },
      },
      boxShadow: {
        "ocean-glow": "0 0 20px -5px rgba(0, 210, 255, 0.15)",
        "cyan-glow": "0 0 15px rgba(0, 210, 255, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
