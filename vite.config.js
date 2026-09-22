import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",

  // vite default values, not strictly necessary
  server: {
    port: 5173,
    open: true,
  },
});
