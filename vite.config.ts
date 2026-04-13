import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  // Allow importing (and HMR) from sibling folders next to this repo, e.g. a separate stage package.
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
})
