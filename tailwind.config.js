/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          emerald: '#10B981',
          violet: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#EF4444',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        game: ['"Outfit"', 'sans-serif'],
        code: ['"Fira Code"', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-short': 'bounceShort 0.5s ease-in-out 2'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
