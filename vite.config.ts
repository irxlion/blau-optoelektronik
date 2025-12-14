import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// Plugins - vitePluginManusRuntime kann Tests automatisch ausführen
// Wenn Probleme auftreten, temporär deaktivieren:
const plugins = [
  react(), 
  tailwindcss(), 
  jsxLocPlugin()
  // vitePluginManusRuntime() - temporär deaktiviert, da es Tests automatisch ausführt
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: false, // Will find next available port if 5173 is busy
    host: true,
    // Proxy für API-Routen zu Netlify Functions (falls netlify dev auf Port 8888 läuft)
    // WICHTIG: Für vollständige Funktionalität sollte 'pnpm dev' (netlify dev) verwendet werden
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true,
        secure: false,
        // Fallback: Wenn netlify dev nicht läuft, zeige hilfreiche Fehlermeldung
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            console.warn('⚠️  Netlify Functions nicht erreichbar. Bitte verwenden Sie "pnpm dev" statt "pnpm dev:client"');
          });
        },
      },
    },
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
