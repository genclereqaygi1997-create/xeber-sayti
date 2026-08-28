/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111318",
        paper: "#fafaf9",
        brand: {
          50: "#eef4ff",
          100: "#dce8ff",
          200: "#b8d0ff",
          300: "#8bb1ff",
          400: "#5b8bff",
          500: "#2f63f6",
          600: "#1f49d1",
          700: "#1c3aa6",
          800: "#1a3184",
          900: "#182c6c",
        },
        accent: {
          500: "#e9483f",
          600: "#d43a32",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,19,24,0.06), 0 8px 24px -12px rgba(17,19,24,0.12)",
      },
    },
  },
  plugins: [],
};
