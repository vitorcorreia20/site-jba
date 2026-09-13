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
        dourado: {
          DEFAULT: "#C9A227",
          claro: "#E4C25C",
        },
        papel: "#FAFAF7",
        grafite: "#20232B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
