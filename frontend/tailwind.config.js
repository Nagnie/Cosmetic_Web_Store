/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#91775E", // Warm brown, replacing previous pink
          light: "#C8B6A6", // Lighter brown from "Why Choose Us" section
          dark: "#675746", // Darker brown for buttons and accents
          deepest: "#574A3A", // Very deep brown for text and headings
          medium: "#8d7053",
        },
        secondary: {
          DEFAULT: "#F1DEC9", // Soft cream tone from "Why Choose Us" section
          light: "#A4907C", // Muted terracotta
          medium: "#C8B6A6", // Soft brown
          deep: "#91775E", // Deeper warm brown
        },
        overlay: {
          DEFAULT: "rgba(145, 119, 94, 0.2)", // Matching primary color with opacity
          dark: "rgba(103, 87, 70, 0.5)", // Darker brown overlay
        },
        neutral: {
          DEFAULT: "#FFFFFF",
          dark: "#000000",
          gray: "#6B7280",
          text: "#333333", // A softer black for text
        },
        background: {
          DEFAULT: "#FAF5F0", // Soft, warm background color
          light: "#FFFAF3", // Even lighter variant
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
