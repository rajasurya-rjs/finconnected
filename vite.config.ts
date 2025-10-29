import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// optionally include bundle visualizer when ANALYZE_BUNDLE env var is set
// bundle visualizer is loaded inline in plugins only when ANALYZE_BUNDLE is true

export default defineConfig({
  base: './', // Ensure assets are loaded relative to index.html
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.ANALYZE_BUNDLE === 'true'
      ? [
          await import('rollup-plugin-visualizer').then((m) =>
            m.visualizer({ filename: './dist/bundle-visualizer.html', gzipSize: true }),
          ),
        ]
      : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Ensure proper module output
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.match(/node_modules.*(recharts|d3|chart.js|victory|highcharts)/)) {
              return 'charts-vendor';
            }
            if (id.match(/node_modules.*(react|react-dom)/)) {
              return 'react-vendor';
            }
            if (id.match(/node_modules.*(@tanstack|@tanstack\/react-query|@tanstack\/query)/)) {
              return 'query-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
