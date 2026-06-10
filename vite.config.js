import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/Yann-Hadal/' : '/',
  server: {
    port: 3000,
    proxy: {
      '/api/linbrain': {
        target: 'http://localhost:8100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/linbrain/, '')
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
