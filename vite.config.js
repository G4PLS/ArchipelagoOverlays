import { defineConfig } from 'vite'
import { resolve } from 'path'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  base: '/ArchipelagoOverlays',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        alert_config: resolve(__dirname, '/Alerts/alert_config.html'),
        alert: resolve(__dirname, '/Alerts/alert.html'),
      }
    }
  },
  resolve: {
    alias: {
        '@': resolve(__dirname, 'src')
    }
  }
})