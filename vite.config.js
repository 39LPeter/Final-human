import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If you deploy to a subdirectory (e.g., ngo.com/app), change base to '/app/'
  base: '/', 
  server: {
    port: 3000, // Default development port
    open: true, // Open browser on start
  },
  build: {
    outDir: 'dist', // Output directory for production files
    emptyOutDir: true,
  }
})
