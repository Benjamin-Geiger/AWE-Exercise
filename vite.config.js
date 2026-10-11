import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = "/AWE-Exercise/";

// BrowserRouter fallback for the react app: every <base>react/... url must deliver react.html
function reactRouterFallback() {
  const reactRoute = new RegExp(`^${base}react(/[^.]*)?(\\?.*)?$`);
  const rewrite = (req, _res, next) => {
    if (req.url && reactRoute.test(req.url)) req.url = `${base}react.html`;
    next();
  };
  return {
    name: "react-router-fallback",
    // run after vite's html plugin, so react.html is already in the bundle
    enforce: "post",
    // dev: without this vite would fall back to the vanilla index.html
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
    // GitHub Pages: unknown paths are answered with 404.html -> make it the react app
    generateBundle(_options, bundle) {
      const page = bundle["react.html"];
      if (page?.type === "asset") {
        this.emitFile({ type: "asset", fileName: "404.html", source: page.source });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), reactRouterFallback()],
  root: ".",
  publicDir: "public",
  base,

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
