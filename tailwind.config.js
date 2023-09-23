import colors from "tailwindcss/colors"

/** @type {import('tailwindcss').Config} */
module.exports = {
  variants: {
    extend: {
      backgroundImage: ["before"],
      blur: ["before"],
      opacity: ["before"],
    },
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.purple,
      },
      transitionTimingFunction: {
        "background-polygon": "cubic-bezier(.5,.1,.5,.9)",
      },
      animation: {
        "swipe-in": "swipe-in 0.3s ease-out",
        "dissolve-out": "dissolve-out 0.3s ease-in forwards",
      },
      keyframes: {
        "swipe-in": {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        "dissolve-out": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: ["light", "night"],
    darkTheme: "night",
    logs: false,
  },
}
