import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0f0f0f",
          secondary: "#161616",
          card: "#1a1a1a",
          elevated: "#1f1f1f",
          hover: "#222222",
        },
        accent: {
          red: "#e53e3e",
          "red-light": "#fc8181",
          "red-dark": "#c53030",
          "red-glow": "rgba(229,62,62,0.15)",
        },
        border: {
          default: "#2a2a2a",
          subtle: "#222222",
          accent: "#e53e3e",
        },
        text: {
          primary: "#f5f5f5",
          secondary: "#a0a0a0",
          muted: "#606060",
          accent: "#fc8181",
        },
        status: {
          active: "#48bb78",
          inactive: "#718096",
          pending: "#ecc94b",
          rejected: "#fc8181",
          approved: "#48bb78",
          completed: "#63b3ed",
          cancelled: "#fc8181",
          processing: "#ecc94b",
          failed: "#fc8181",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "system-ui"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.5)",
        "accent-glow": "0 0 20px rgba(229,62,62,0.2)",
      },
      backgroundImage: {
        "gradient-card": "linear-gradient(135deg, #1a1a1a 0%, #161616 100%)",
        "gradient-accent": "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
        "gradient-subtle": "linear-gradient(180deg, #1f1f1f 0%, #1a1a1a 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
