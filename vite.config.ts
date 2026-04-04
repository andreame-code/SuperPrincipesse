import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? process.env.VITE_BASE_PATH ?? "/SuperPrincipesse/" : "/",
  server: {
    host: "127.0.0.1",
    port: 5173
  }
}));
