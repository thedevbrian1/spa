import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-red': '#F32E21'
      }
    },
  },
  plugins: [],
} satisfies Config;
