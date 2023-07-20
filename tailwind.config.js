module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ['"PT Sans"', "sans-serif"],
    },
    extend: {
      colors: {
        light: "#e2d9e2",
        dark: "#130f26",
        primary: "#513a68",
        secondary: "#b6558a",
        info: "#b97693",
        accent1: "#494165",
        accent2: "#6b6d93",
        accent3: "#a6a9a9",
        accent4: "#E0659F",
        accent5: "#E17D62",
        accent6: "#E17082",
        accent7: "#F5F4F1",
        success: "#3ca06c",
        warning: "#dccc3d",
        danger: "#e53622",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
