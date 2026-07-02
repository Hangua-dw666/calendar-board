/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#f5f0e6',        // 米黄纸张色 - 主背景
          card: '#fffaf0',      // 花白 - 卡片背景
          hover: '#ede4d0',     // 略深米色 - 悬停
          border: '#d4c5a0',    // 棕黄 - 边框
          green: '#6b8e4e',     // 复古橄榄绿 - 主点缀
          blue: '#5b7c99',      // 复古蓝
          purple: '#9b6b9e',    // 复古紫
          red: '#c44536',       // 砖红
          yellow: '#d4a017',    // 赭石黄 - 灵感碎片
          text: '#3d3528',      // 深棕 - 主文字
          muted: '#8a7a65',     // 浅棕 - 次要文字
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
