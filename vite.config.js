import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    copyPublicDir: false, // Prevents duplicating ~1GB of master_data media files into dist
  },
  server: {
    host: true,
    fs: {
      allow: ["..", "."]
    }
  }
})
