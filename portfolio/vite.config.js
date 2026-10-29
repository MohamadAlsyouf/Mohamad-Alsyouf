import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep the 3D engine independently cacheable and outside the initial UI.
          if (id.replaceAll('\\', '/').includes('/node_modules/three/')) {
            return 'three'
          }
        },
      },
    },
  },
})
