import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev mode (npm run dev) API calls are proxied to the Express server on port 5001.
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {}
  },
  server: { port: 5173, proxy: { "/api": "http://127.0.0.1:5001" } }
});

