import { cloudflare } from "@cloudflare/vite-plugin";
import TailwindCSS from "@tailwindcss/vite";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    environments: {
      client: {
        build: {
          rollupOptions: {
            input: {
              main: resolve(__dirname, "index.html"),
            },
          },
        },
      },
    },

    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: "",
      },
    },

    plugins: [tsconfigPaths(), TailwindCSS(), cloudflare()],

    preview: {
      cors: false,
      headers: headers("preview"),
    },

    server: {
      cors: false,
      headers: headers("server"),
    },
  };
});

function headers(env: "preview" | "server") {
  return {
    "content-security-policy": csp(env),
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-resource-policy": "same-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "x-robots-tag": "noindex",
    "Referrer-Policy": "no-referrer",
  };
}

function csp(env: "preview" | "server") {
  const common = `default-src 'self';base-uri 'self';font-src 'none';form-action 'none';frame-ancestors ${process.env.VITE_PARENT_ORIGIN};img-src 'self' data:;object-src 'none';script-src-attr 'none';`;
  return env === "server"
    ? `${common}script-src 'self' https://www.youtube.com 'unsafe-inline';style-src 'self' 'unsafe-inline';frame-src https://www.youtube.com;worker-src blob:`
    : `${common}script-src 'self' https://www.youtube.com;style-src 'self';frame-src https://www.youtube.com`;
}
