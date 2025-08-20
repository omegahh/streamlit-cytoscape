import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./",
  publicDir: "public",
  server: {
    port: 3001,
    host: "localhost",
  },
  build: {
    outDir: "build",
    sourcemap: true,
    rollupOptions: {
      input: "./public/index.html",
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          cytoscape: ["cytoscape", "cytoscape-fcose", "cytoscape-klay"],
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
})

