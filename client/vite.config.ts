import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['/*.png', '/.jpg', '**/.jpeg', '/*.gif', '/*.svg'],
  build: {
    outDir: 'dist',
    copyPublicDir: true,
    assetsDir: 'assets',
  },
  server: {
    host: true,
    port: 80, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
