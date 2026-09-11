/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // إضافة درجات الألوان لتتطابق مع التصميم الداكن الأصلي
        darkBg: '#0b1329',
        cardBg: '#131b31',
      },
    },
  },
  plugins: [],
}