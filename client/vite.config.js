import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev-server only — lets the client's relative /api/* calls reach the
    // standalone API process during `npm run dev` without needing a
    // VITE_API_URL override. Doesn't affect production builds: there the
    // built files are served by Express itself (or by nginx, in the Docker
    // path), so /api/* is already same-origin.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
