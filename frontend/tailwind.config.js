/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#D14D72", // Used for pagination bullets, links
                    dark: "#911f3f", // Used for headings
                    darker: "#ab3556", // Used for buttons
                    deepest: "#911f3f", // Used for text
                },
                secondary: {
                    DEFAULT: "#FDE5EC", // Lightest pink (Why Choose Us section)
                    medium: "#FFD1DA", // Medium pink (Why Choose Us section)
                    deep: "#ffbccc", // Deeper pink (Why Choose Us section)
                },
                overlay: {
                    DEFAULT: "rgba(209, 77, 114, 0.2)", // Slider overlay with 20% opacity
                    dark: "rgba(145, 31, 63, 0.5)", // Dark overlay (from-pink-950/50)
                },
                neutral: {
                    DEFAULT: "#FFFFFF",
                    dark: "#000000",
                    gray: "#6B7280", // text-gray-600
                },
            },
        },
    },
    plugins: [],
};
