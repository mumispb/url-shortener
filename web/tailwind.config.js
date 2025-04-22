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
      },
      fontSize: {
        xxs: "0.625rem",
        "text-xl": [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "bold",
          },
        ],
        "text-lg": [
          "18px",
          {
            lineHeight: "24px",
            fontWeight: "bold",
          },
        ],
        "text-md": [
          "14px",
          {
            lineHeight: "18px",
            fontWeight: "600",
          },
        ],
        "text-sm": [
          "12px",
          {
            lineHeight: "16px",
            fontWeight: "400",
            // Regular & SemiBold handled via classes, default is regular
          },
        ],
        "text-xs": [
          "10px",
          {
            lineHeight: "14px",
            fontWeight: "400",
            textTransform: "uppercase",
          },
        ],
      },
      fontFamily: {
        sans: ["Open Sans", ...theme.fontFamily.sans],
      },
      // boxShadow: {
      //   shape:
      //     "0px 8px 8px rgba(0, 0, 0, 0.1), 0px 4px 4px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 0px 0px 1px rgba(255, 255, 255, 0.03), inset 0px 1px 0px rgba(255, 255, 255, 0.03)",
      //   "shape-content":
      //     "0px 0px 0px 1px rgba(0, 0, 0, 0.25), inset 0px 1px 0px rgba(255, 255, 255, 0.02), inset 0px 0px 0px 1px rgba(255, 255, 255, 0.02)",
      // },
      // animation: {
      //   border: "border 2s linear infinite",
      // },
      // keyframes: {
      //   border: {
      //     to: { "--border-angle": "360deg" },
      //   },
      // },
    },
  },
  plugins: [],
};
