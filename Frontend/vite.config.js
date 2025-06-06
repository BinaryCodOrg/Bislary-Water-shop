import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import path from "path";

export default defineConfig({
  plugins: [
    react(),

    // Electron Plugin
    electron([
      {
        // 👇 Main process
        entry: "src/electron/main.js",
      },
      {
        // 👇 Preload script
        entry: "src/electron/preload.js",
        onstart(options) {
          // Automatically reload renderer when preload changes
          options.reload();
        },
      },
    ]),
  ],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
