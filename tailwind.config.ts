import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { pitch: { 600: "#15803d", 700: "#166534", 900: "#14301f" } } } },
  plugins: [],
} satisfies Config;
