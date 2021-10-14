module.exports = {
  darkMode: false, // or 'media' or 'class'
  mode: "jit",
  plugins: [
    require("@tailwindcss/typography"),
  ],
  purge: ["./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
};
