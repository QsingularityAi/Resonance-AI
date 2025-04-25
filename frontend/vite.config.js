import { fileURLToPath, URL } from "node:url"
import { resolve } from "path"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import svgLoader from "vite-svg-loader"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ customElement: true }), svgLoader()],
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.__VUE_PROD_DEVTOOLS__": '"false"'
  },
  build: {
    outDir: "../dist/static",
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      fileName: "chatbot",
      formats: ["es"]
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
})
