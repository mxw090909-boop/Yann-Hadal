import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/Yann-Hadal/' : '/',
  server: {
    port: 3000,
    proxy: {
      '/hadal': {
        target: 'http://localhost:8793',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
