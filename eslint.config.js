import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  // Never lint generated or installed code dist/
  { ignores: ["dist/", "node_modules/"] },

  // base ruleset: unused variables, unreachable code, duplicate keys, etc.
  js.configs.recommended,

  // ts parser & rules, without .ts files are skipped
  ...tseslint.configs.recommended,

  // Declaring the environment is what stops the linter from reporting the browser API as undefined variables
  {
    files: ["src/**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module", // modules: import/export
      globals: globals.browser, // document, window, fetch, localStorage
    },
  },

  {
    files: ["vite.config.js", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },

  // prettier last to avoid conflicts with other rules
  prettier,
];
