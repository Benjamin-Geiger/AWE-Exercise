import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  base: "/AWE-Exercise/",

  // two entry pages for old&react
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
