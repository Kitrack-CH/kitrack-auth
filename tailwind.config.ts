import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kitrack: {
          white: "#FFFFFF",
          black: "#000000",
          blueLight: "#70B5FA",
          blue: "#1E88E5",
          blueDark: "#06398A",
          orangeLight: "#ebbd86",
          orange: "#eb9834",
          orangeDark: "#d13800",
          greenLight: "#a7e4c2",
          green: "#2fbf71",
          greenDark: "#1e8f53",
        },
      },
    },
  },
  plugins: [],
};

export default config;
