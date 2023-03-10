//tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand100: "#f39e31",
        red100: "#FB4646",
        blue100: "#0066FF",
        mono100: "#333333",
        mono80: "#777777",
        mono70: "#AFAFAF",
        mono60: "#C1C1C1",
        mono50: "#DFDFDF",
        mono40: "#F6F6F6",
        mono30: "#F5F5F5",
      },
      // 채하꺼
      keyframes: {
        "up-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateX(-100px)",
          },
          "30%": {
            opacity: "0.5",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0px)",
          },
        },
      },
      animation: {
        "up-down": "up-down 2s ease-out linear",
        "fade-in": "fade-in 2s ease-out infinite",
        "bounce-fast": "bounce 0.8s infinite",
      },
      backgroundImage: {
        chihiro: "url('../public/images/chihiro.jpg')",
        coverBg: "url('../public/images/cover-kiki.jpeg')",
      },
      //폰트
      fontFamily: {
        sans: ["pretendard", "Arial", "sans-serif"],
        // sans가 제일 기본 상속 폰트이므로 전체 폰트바꾸려면 sans재지정후 맨앞에 원하는 폰트 넣기
      },
    },
  },
  variants: {},
  plugins: [],
};
