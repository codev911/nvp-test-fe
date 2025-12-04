import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          900: '#0b1220',
          950: '#050915',
        },
      },
      boxShadow: {
        glow: '0 10px 50px rgba(94, 234, 212, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
