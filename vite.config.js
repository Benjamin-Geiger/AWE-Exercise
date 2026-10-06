import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: "/AWE-Exercise/",

  // two entry pages while migrating: vanilla on index.html, React on react.html
  build: {
    rolldownOptions: {
      input: {
        main: "index.html",
        react: "react.html",
      },
    },
  },

  // vite default values, not strictly necessary
  server: {
    port: 5173,
    open: true,
  },
});
