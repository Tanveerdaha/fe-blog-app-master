import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://be-blog-app-master-production.up.railway.app',
        secure: false
      }
      ,
      '/uploads': {
        target: 'https://be-blog-app-master-production.up.railway.app',
        secure: false
      }
    }
  },
  plugins: [react()]
})

