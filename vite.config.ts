import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Use the repo name as base so assets resolve correctly on GitHub Pages.
  base: '/waa-granular/',
  plugins: [react()],
  build: {
    target: 'esnext',
    // Emit static site to docs/ for GitHub Pages.
    outDir: 'docs',
  },
})
