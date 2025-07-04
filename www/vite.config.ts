// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter as router } from "@tanstack/router-plugin/vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [
    router({
      target: "react",
      autoCodeSplitting: true,
      addExtensions: true,
    }),
    react(),
    tailwindcss(),
    deno(),
  ],
});
