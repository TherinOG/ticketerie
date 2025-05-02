/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Bleu doux
        accent: '#F59E0B', // Orange chaleureux
        background: '#F3F4F6', // Gris clair
        error: '#EF4444', // Rouge pour erreurs
        success: '#10B981', // Vert pour succès
      },
      animation: {
        'bounce-in': 'bounce-in 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-in',
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};