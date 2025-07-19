/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 5s linear infinite",
        "fade-in-up-rotate-19": "fadeInUpRotate19 0.8s ease-out forwards",
        "fade-in-up-rotate--58": "fadeInUpRotateNeg58 0.8s ease-out forwards",
        "fade-in-up-rotate--24": "fadeInUpRotateNeg24 0.8s ease-out forwards",
        "fade-in-up-rotate--17": "fadeInUpRotateNeg17 0.8s ease-out forwards",
        "fade-in-up": "fadeInUpRotate0 0.8s ease-out forwards",
      },
      keyframes: {
        fadeInUpRotate19: {
          "0%": { opacity: "0", transform: "rotate(19deg) translateY(20px)" },
          "100%": { opacity: "1", transform: "rotate(19deg) translateY(0)" },
        },
        fadeInUpRotateNeg58: {
          "0%": { opacity: "0", transform: "rotate(-58deg) translateY(20px)" },
          "100%": { opacity: "1", transform: "rotate(-58deg) translateY(0)" },
        },
        fadeInUpRotateNeg24: {
          "0%": { opacity: "0", transform: "rotate(-24deg) translateY(20px)" },
          "100%": { opacity: "1", transform: "rotate(-24deg) translateY(0)" },
        },
        fadeInUpRotateNeg17: {
          "0%": { opacity: "0", transform: "rotate(-17deg) translateY(20px)" },
          "100%": { opacity: "1", transform: "rotate(-17deg) translateY(0)" },
        },
        fadeInUpRotate0: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

