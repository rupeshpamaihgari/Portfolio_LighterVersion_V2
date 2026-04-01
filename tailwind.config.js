/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: 'rgb(234,232,225)',
        primary: '#1a1a1a',
        secondary: '#555555',
        muted: '#888888',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
      },
      maxWidth: {
        content: '1200px',
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'marquee-reverse': 'marquee 25s linear infinite reverse',
        'marquee-slow': 'marquee 25s linear infinite',
        'pulse-dot': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeInUp: 'fadeInUp 0.7s cubic-bezier(0.33, 1, 0.68, 1) forwards',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
