import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  preview: {
    host: '0.0.0.0',
    port: 10000,
    allowedHosts: [
  'legacy-landing-page.onrender.com',
  'legacy-landing-page-1.onrender.com',
  'legacypartners.agency',
  'www.legacypartners.agency'
],
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['legacy-landing-page.onrender-1.com'],
  },
})
