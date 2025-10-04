const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Light theme colors (default)
        border: {
          DEFAULT: 'rgb(240, 242, 245)', // #F0F2F5
          dark: 'rgb(41, 48, 56)', // #293038
        },
        input: {
          DEFAULT: 'rgb(240, 242, 245)',
          dark: 'rgb(41, 48, 56)',
        },
        ring: {
          DEFAULT: 'rgb(5, 211, 219)', // #05D3DB
          dark: 'rgb(33, 172, 177)', // #21ACB1
        },
        background: {
          DEFAULT: 'rgb(255, 255, 255)', // #FFFFFF
          dark: 'rgb(18, 20, 23)', // #121417
        },
        foreground: {
          DEFAULT: 'rgb(18, 20, 23)', // #121417
          dark: 'rgb(255, 255, 255)', // #FFFFFF
        },
        primary: {
          DEFAULT: 'rgb(5, 211, 219)', // #05D3DB
          foreground: {
            DEFAULT: 'rgb(255, 255, 255)',
            dark: 'rgb(255, 255, 255)',
          },
          dark: 'rgb(33, 172, 177)', // #21ACB1
        },
        secondary: {
          DEFAULT: 'rgb(240, 242, 245)', // #F0F2F5
          foreground: {
            DEFAULT: 'rgb(18, 20, 23)',
            dark: 'rgb(255, 255, 255)',
          },
          dark: 'rgb(41, 48, 56)', // #293038
        },
        muted: {
          DEFAULT: 'rgb(240, 242, 245)',
          foreground: {
            DEFAULT: 'rgb(99, 115, 135)', // #637387
            dark: 'rgb(99, 115, 135)',
          },
          dark: 'rgb(41, 48, 56)',
        },
        accent: {
          DEFAULT: 'rgb(5, 211, 219)',
          foreground: {
            DEFAULT: 'rgb(255, 255, 255)',
            dark: 'rgb(255, 255, 255)',
          },
          dark: 'rgb(33, 172, 177)',
        },
        destructive: {
          DEFAULT: 'rgb(239, 68, 68)',
          foreground: {
            DEFAULT: 'rgb(255, 255, 255)',
            dark: 'rgb(255, 255, 255)',
          },
          dark: 'rgb(239, 68, 68)',
        },
        card: {
          DEFAULT: 'rgb(255, 255, 255)',
          foreground: {
            DEFAULT: 'rgb(18, 20, 23)',
            dark: 'rgb(255, 255, 255)',
          },
          dark: 'rgb(41, 48, 56)',
        },
      },
      fontFamily: {
        'manrope-regular': ['Manrope_400Regular'],
        'manrope-medium': ['Manrope_500Medium'],
        'manrope-bold': ['Manrope_700Bold'],
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};
