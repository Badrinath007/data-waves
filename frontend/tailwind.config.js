/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {animation: {
      fadeIn: 'fadeIn 1.5s ease-out forwards',
      slideUp: 'slideUp 1s ease-out forwards',
      zoomIn: 'zoomIn 0.5s ease-out forwards',
      bounceIn: 'bounceIn 1s ease-in-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      slideUp: {
        '0%': { transform: 'translateY(20px)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
      zoomIn: {
        '0%': { transform: 'scale(0.9)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 },
      },
      bounceIn: {
        '0%': { transform: 'scale(0)' },
        '50%': { transform: 'scale(1.2)' },
        '100%': { transform: 'scale(1)' },
      },
    },},
  },
  plugins: [],
}

