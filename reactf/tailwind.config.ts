import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'sans': ['"ui-monospace"', ...defaultTheme.fontFamily.sans],
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'green': '#14532d',
      'red': '#b91c1c',
      'black': '#262626',
      'buttonwhite': '#d4d4d8'
      
    }
  },
  // plugins: [require('flowbite/plugin')],
};
export default config;
