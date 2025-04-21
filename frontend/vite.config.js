import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // нужен для работы ngrok
    allowedHosts: [
      '0f98-154-47-24-154.ngrok-free.app', // ваш текущий ngrok-хост
      '.ngrok-free.app' // или все поддомены ngrok
    ]
  }
})
