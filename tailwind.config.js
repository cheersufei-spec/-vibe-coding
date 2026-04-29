/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F7F6F1',
        primary: '#1F1F1F',
        secondary: '#666666',
        accent: '#BFA173',
        'risk-high': '#B42318',
        'risk-mid': '#B54708',
        'risk-low': '#027A48',
      },
      fontFamily: {
        sans: ['"Inter"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
