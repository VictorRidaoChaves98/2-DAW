import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    proxy: {
      // Redirige todas las peticiones a /v1/... al LM Studio local
      '/v1': 'http://localhost:1234'
    }
  }
})
