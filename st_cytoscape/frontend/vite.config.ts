import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { streamlitComponentPlugin } from "./vite-streamlit-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), streamlitComponentPlugin()],
  root: "./",
  publicDir: "public",
  base: "./", // Use relative paths for Streamlit component serving
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
        // Ensure assets are referenced with relative paths
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks: {
          vendor: ["react", "react-dom"],
          cytoscape: ["cytoscape", "cytoscape-fcose", "cytoscape-klay"],
        },
      },
    },
    // Copy public assets to build root
    copyPublicDir: false, // We'll handle this manually
    emptyOutDir: true,
  },
  define: {
    global: "globalThis",
  },
})
