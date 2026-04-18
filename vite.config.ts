import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Git submodule `steps-project-slot` — same pattern as `luna-sidebar` (pinned commit, not npm). */
const stepsProjectSlotRoot = path.resolve(__dirname, 'steps-project-slot')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      stepscreen: stepsProjectSlotRoot,
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..'), stepsProjectSlotRoot],
    },
  },
})
