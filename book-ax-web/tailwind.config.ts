import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e5f5',
          100: '#e1bee7',
          200: '#ce93d8',
          300: '#ba68c8',
          400: '#ab47bc',
          500: '#9C27B0',
          600: '#8e24aa',
          700: '#7b1fa2',
          800: '#6a1b9a',
          900: '#4a148c',
          DEFAULT: '#9C27B0',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#065f46',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#92400e',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#991b1b',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],      // 14px (mindestens!)
        'sm': ['1rem', { lineHeight: '1.5rem' }],            // 16px
        'base': ['1.125rem', { lineHeight: '1.75rem' }],     // 18px
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],        // 20px
        'xl': ['1.5rem', { lineHeight: '2rem' }],            // 24px
        '2xl': ['1.75rem', { lineHeight: '2.25rem' }],       // 28px
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],        // 36px
        '4xl': ['2.75rem', { lineHeight: '3rem' }],          // 44px
        '5xl': ['3.5rem', { lineHeight: '1.2' }],            // 56px
        '6xl': ['4.5rem', { lineHeight: '1.1' }],            // 72px
      },
    },
  },
  plugins: [],
};

export default config;
