// @lovable.dev/vite-tanstack-config already includes the following. Do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import type { IncomingMessage } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import tsConfigPaths from "vite-tsconfig-paths";

function loadLocalDevVars() {
  const path = fileURLToPath(new URL("./.dev.vars", import.meta.url));

  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function localSchedulingApi() {
  return {
    name: "local-scheduling-api",
    config() {
      loadLocalDevVars();
    },
    configureServer(server: { middlewares: { use: (path: string, handler: (req: IncomingMessage, res: any) => void) => void } }) {
      server.middlewares.use("/api/scheduling", (req, res) => {
        const chunks: Buffer[] = [];

        req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        req.on("end", async () => {
          try {
            const { handleSchedulingRequest } = await import("./src/lib/scheduling/http");
            const request = new Request(`http://127.0.0.1${req.url ?? "/api/scheduling"}`, {
              method: req.method,
              headers: req.headers as HeadersInit,
              body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
            });
            const response = await handleSchedulingRequest(request);
            res.statusCode = response.status;
            response.headers.forEach((value, key) => res.setHeader(key, value));
            res.end(await response.text());
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: "internal" }));
          }
        });
      });
    },
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this; wrangler.jsonc main alone is insufficient.
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: [tsConfigPaths(), localSchedulingApi()],
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
