import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090C",
        foreground: "#F9FAFB",
        card: {
          DEFAULT: "#131722",
          foreground: "#F9FAFB",
          hover: "#181E2C",
        },
        border: {
          subtle: "#1E2433",
          DEFAULT: "#283044",
          active: "#00F0FF",
        },
        brand: {
          cyan: "#00F0FF",
          blue: "#3B82F6",
          indigo: "#6366F1",
          purple: "#8B5CF6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 25px rgba(0, 240, 255, 0.3)",
        "glow-blue": "0 0 35px rgba(59, 130, 246, 0.3)",
        "glow-purple": "0 0 35px rgba(139, 92, 246, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
