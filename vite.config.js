import { defineConfig } from 'vite'
import {resolve } from 'path'
import injectHTML from 'vite-plugin-html-inject'

export default defineConfig({
  base: "/ArchipelagoOverlays/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        alert: resolve(__dirname, 'alert/index.html'),
        config: resolve(__dirname, 'alert/config.html'),
        media: resolve(__dirname, 'media.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [injectHTML({
    replace: {undefined: "0.1.0-alpha.1"}
  })]
})
