/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F4D3B', // Deep Green
          dark: '#143528',
          light: '#2B6B53',
          50: '#F0F7F4',
          100: '#DCEFE7',
          200: '#B9DFC0',
        },
        secondary: {
          DEFAULT: '#6B4F3B', // Rich Brown
          dark: '#4A3729',
          light: '#8C684E',
        },
        accent: {
          DEFAULT: '#2E7D57', // Forest Green
          hover: '#246646',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#18221D',
          cardDark: '#1F2C26',
        },
        background: {
          light: '#F5F7F6', // Cool Gray
          dark: '#0F1714',
        },
        slate: {
          text: '#1F2937',
        },
        border: {
          DEFAULT: '#D1D5DB',
          dark: '#2D3F36',
        },
        status: {
          success: '#16A34A',
          danger: '#DC2626',
          warning: '#F59E0B',
          info: '#2563EB',
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(31, 77, 59, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'soft-hover': '0 10px 25px -5px rgba(31, 77, 59, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 77, 59, 0.07)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
