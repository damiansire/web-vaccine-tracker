// tailwind.config.js
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      tableLayout: ["hover", "focus"],
      textColor: ["responsive", "hover", "focus", "group-hover"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
