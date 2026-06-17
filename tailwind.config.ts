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
        brand: {
          50: "#fdf4f3",
          100: "#fce8e6",
          500: "#c45c4a",
          600: "#b04a38",
          700: "#933d30",
        },
      },
    },
  },
  plugins: [],
};

export default config;
