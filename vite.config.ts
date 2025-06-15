import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  base: './',
  build: {
    outDir: 'build',
    target: ['es2021', 'chrome100', 'safari13'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      "@logic": path.resolve(__dirname, './src/components/logic'),
      "@ui": path.resolve(__dirname, './src/components/ui'),
      "@routes": path.resolve(__dirname, './src/routes'),
      "@screens": path.resolve(__dirname, './src/screens'),
      "@assets": path.resolve(__dirname, './src/assets'),
      "@fonts": path.resolve(__dirname, './src/assets/fonts'),
      "@icons": path.resolve(__dirname, './src/assets/icons'),
      "@images": path.resolve(__dirname, './src/assets/images'),
    },
  },
  server: {
    port: 3000,
  },
})
