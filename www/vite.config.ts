// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter as router } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    router({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "~/*": "./src/",
    },
  },
});
