import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        azul: {
          DEFAULT: "#14264D",
          escuro: "#0C182F",
          claro: "#233B6E",
        },
        vermelho: {
          DEFAULT: "var(--crimson-2)",
          escuro: "var(--crimson)",
          claro: "var(--crimson-soft)",
          deep: "var(--crimson-deep)",
        },
        dourado: {
          DEFAULT: "var(--gold)",
          claro: "var(--gold-light)",
          faint: "var(--gold-faint)",
        },
        papel: "var(--paper)",
        "papel-2": "var(--paper-2)",
        grafite: "var(--ink)",
        ink: "var(--ink)",
        crimson: {
          DEFAULT: "var(--crimson)",
          2: "var(--crimson-2)",
          deep: "var(--crimson-deep)",
          soft: "var(--crimson-soft)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-instrument)", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      borderRadius: {
        card: "var(--radius)",
      },
      boxShadow: {
        soft: "var(--shadow)",
        strong: "var(--shadow-strong)",
      },
      keyframes: {
        heroIn: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        heroIn: "heroIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
