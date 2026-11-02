import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev mode (npm run dev) API calls are proxied to the Express server on port 5001.
// In production builds the VITE_API_URL env var points at the deployed backend, or
// the Express server itself serves the built client (same-origin, no proxy needed).
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {}
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: false
  }
});

