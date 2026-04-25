/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'primary-hover': '#4338CA',
        'primary-light': '#EEF2FF',
        'primary-border': '#C7D2FE',
        'bg-page': '#F8FAFC',
        'bg-surface': '#FFFFFF',
        'bg-muted': '#F1F5F9',
        border: '#E2E8F0',
        'border-strong': '#CBD5E1',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',
        success: '#10B981',
        'success-bg': '#ECFDF5',
        'success-text': '#065F46',
        danger: '#EF4444',
        'danger-bg': '#FEF2F2',
        'danger-text': '#991B1B',
        warning: '#F59E0B',
        'warning-bg': '#FFFBEB',
        'warning-text': '#92400E',
        info: '#3B82F6',
        'info-bg': '#EFF6FF',
        'info-text': '#1E40AF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(5%)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'bounce-slow': 'bounce-slow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.animation-delay-100': {
          'animation-delay': '100ms',
        },
        '.animation-delay-200': {
          'animation-delay': '200ms',
        },
        '.animation-delay-300': {
          'animation-delay': '300ms',
        },
        '.animation-delay-400': {
          'animation-delay': '400ms',
        },
        '.animation-delay-500': {
          'animation-delay': '500ms',
        },
      };
      addUtilities(newUtilities);
    }
  ],
}
