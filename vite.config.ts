import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// Plugin to inject environment variables into service worker
function injectEnvToServiceWorker(): Plugin {
  return {
    name: 'inject-env-to-sw',
    generateBundle() {
      const swPath = resolve(__dirname, 'public/firebase-messaging-sw.js')
      let swContent = readFileSync(swPath, 'utf-8')

      // Replace placeholders with actual env values
      swContent = swContent.replace('%VITE_FIREBASE_API%', process.env.VITE_FIREBASE_API || '')

      writeFileSync(resolve(__dirname, 'dist/firebase-messaging-sw.js'), swContent)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), injectEnvToServiceWorker()],
})
