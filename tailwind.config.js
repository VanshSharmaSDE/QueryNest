/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'primary': 'rgb(var(--primary-color))',
        'secondary': 'rgb(var(--secondary-color))',
        'accent': 'rgb(var(--accent-color))',
        'background': 'rgb(var(--background-color))',
        'card-bg': 'rgb(var(--card-bg-color))',
      },
      borderColor: {
        'default': 'rgb(var(--border-color))',
      },
      textColor: {
        'primary': 'rgb(var(--text-primary))',
        'secondary': 'rgb(var(--text-secondary))',
        'muted': 'rgb(var(--text-muted))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
