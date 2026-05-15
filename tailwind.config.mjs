/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          800: '#1A1A1D',
          900: '#111113',
          950: '#0A0A0B',
        },
        paper: {
          50: '#FAFAF7',
          100: '#F4F4EE',
        },
        accent: {
          DEFAULT: '#F5A524',
          hover: '#E8961A',
        },
        muted: {
          400: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
        },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 12vw, 9rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};
