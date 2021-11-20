module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      screens: {
        sm: "90%",
        md: "90%",
        lg: "1200px",
      },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
