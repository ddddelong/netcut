import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import removeConsole from "vite-plugin-remove-console";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    removeConsole()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
  },
  build: {
    // minify: false,   // 是否丑化
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 分包，将node模块单独打包
          if(id.includes("node_modules")) {
            return 'vendor'
          }
        }
      }
    }
  }
});
