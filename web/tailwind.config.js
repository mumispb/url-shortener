import { theme } from "tailwindcss/defaultConfig";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-base": "#2C46B1",
        "blue-dark": "#2C4091",
        "gray-scale": {
          0: "#FFFFFF",
          100: "#F9F9FB",
          200: "#E4E6EC",
          300: "#CDCFD5",
          400: "#74798B",
          500: "#4D505C",
          600: "#1F2025",
        },
        error: "#B12C4D",
      },
      opacity: {
        2: 0.02,
      },
      spacing: {
        2.25: "0.5625rem",
        1.75: "0.4375rem",
      },
      fontSize: {
        xxs: "0.625rem",
        "text-xl": [
          "1.5rem",
          {
            lineHeight: "2rem",
            fontWeight: "bold",
          },
        ],
        "text-lg": [
          "1.125rem",
          {
            lineHeight: "1.5rem",
            fontWeight: "bold",
          },
        ],
        "text-md": [
          "0.875rem",
          {
            lineHeight: "1.125rem",
            fontWeight: "600",
          },
        ],
        "text-sm": [
          "0.75rem",
          {
            lineHeight: "1rem",
            fontWeight: "400",
            // Regular & SemiBold handled via classes, default is regular
          },
        ],
        "text-xs": [
          "0.625rem",
          {
            lineHeight: "0.875rem",
            fontWeight: "400",
            textTransform: "uppercase",
          },
        ],
      },
      fontFamily: {
        sans: ["Open Sans", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
