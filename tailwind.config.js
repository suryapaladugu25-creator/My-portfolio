/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vice: {
          pink: '#FF007F',
          magenta: '#FF1493',
          hotpink: '#FF69B4',
          cyan: '#00F0FF',
          teal: '#00E5FF',
          purple: '#9D00FF',
          violet: '#7B2CBF',
          yellow: '#FFDE59',
          gold: '#FFB800',
          orange: '#FF5400',
          dark: '#0A0612',
          deep: '#050308',
          card: '#120B20',
          cardBorder: '#2A1845'
        }
      },
      fontFamily: {
        bangers: ['"Bangers"', 'cursive', 'sans-serif'],
        comic: ['"Komika Axis"', '"Bangers"', '"Impact"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'comic-pink': '5px 5px 0px #FF007F',
        'comic-cyan': '5px 5px 0px #00F0FF',
        'comic-yellow': '5px 5px 0px #FFDE59',
        'comic-dark': '6px 6px 0px #050308',
        'neon-pink': '0 0 15px rgba(255, 0, 127, 0.7), 0 0 30px rgba(255, 0, 127, 0.4)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.7), 0 0 30px rgba(0, 240, 255, 0.4)',
        'neon-yellow': '0 0 15px rgba(255, 222, 89, 0.7), 0 0 30px rgba(255, 222, 89, 0.4)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 12px #FF007F)' },
          '50%': { opacity: 0.8, filter: 'drop-shadow(0 0 4px #00F0FF)' },
        },
        palmSway: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(2.5deg)' },
        },
        driveCar: {
          '0%': { transform: 'translateX(-120%) scale(0.95)' },
          '100%': { transform: 'translateX(120vw) scale(1)' },
        },
        neonFlicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: 1 },
          '20%, 24%, 55%': { opacity: 0.3 },
        }
      },
      animation: {
        float: 'float 3.5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        palmSway: 'palmSway 4s ease-in-out infinite',
        driveCar: 'driveCar 3.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        neonFlicker: 'neonFlicker 2.5s infinite',
      }
    },
  },
  plugins: [],
}

