import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  base: "/AWE-Exercise/",

  // vite default values, not strictly necessary
  server: {
    port: 5173,
    open: true,
  },
});
