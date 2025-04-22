import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    // Оптимизации для React 19
    jsxRuntime: 'automatic',
    fastRefresh: true,
  }), tailwindcss()],
  build: {
    minify: 'esbuild', // Используем ESBuild для минификации (быстрее terser)
    sourcemap: false,  // Отключаем sourcemap для продакшена
  },
})
