import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  clean: true,
  format: "esm",
  outDir: "dist",
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".js",
    };
  },
});
