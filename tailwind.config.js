/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'primary-black': '#151313',
        'vibrant-orange': '#ff5734',
        'soft-purple': '#be94f5',
        'warm-yellow': '#fccc42',
        'light-cream': '#f7f7f5',
        'cool-blue-gray': '#d4e4e8',
        
        // Semantic Colors
        'success-green': '#4caf50',
        'warning-red': '#f44336',
        'info-blue': '#2196f3',
        'muted-gray': '#9e9e9e',
        
        // Dark Mode Colors
        'dark-bg': '#1a1a1a',
        'dark-card': '#2d2d2d',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#b3b3b3',
        'dark-border': '#404040',
      },
      fontFamily: {
        'kodchasan': ['Kodchasan', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'section-heading': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-text': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],
        'secondary-text': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
        'small-label': ['0.75rem', { lineHeight: '1.3', fontWeight: '300' }],
      },
      borderRadius: {
        'card': '24px',
        'button': '20px',
        'input': '12px',
        'pill': '20px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'card-xl': '0 8px 32px rgba(0, 0, 0, 0.16)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    screens: {
      'xs': '375px',   // Small mobile
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large
      // Custom breakpoints for specific devices
      'tablet': '768px',
      'laptop': '1024px',
      'desktop': '1280px',
      // Max-width breakpoints
      'max-sm': { 'max': '639px' },
      'max-md': { 'max': '767px' },
      'max-lg': { 'max': '1023px' },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode with class strategy
}