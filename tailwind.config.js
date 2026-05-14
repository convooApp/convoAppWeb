/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        bricolage: ['"Bricolage Grotesque"', 'sans-serif'],
        instrument: ['"Instrument Serif"', 'serif'],
        jetbrains: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        meter: {
          bg: '#0A0608',
          'bg-elev': '#1A0D14',
          'bg-elev-2': '#221218',
          pink: '#FF2D8C',
          'pink-bright': '#FF6BB5',
          'pink-deep': '#B82362',
          lime: '#C6FF00',
          violet: '#A78BFA',
          'violet-deep': '#5B21B6',
          amber: '#FBBF24',
          'amber-deep': '#B45309',
          ivory: '#FFF8F2',
        },
      },
    },
  },
  plugins: [],
};
