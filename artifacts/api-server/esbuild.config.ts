import { build } from "esbuild";
import pinoPlugin from "esbuild-plugin-pino";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  outfile: "dist/index.js",
  plugins: [pinoPlugin({ transports: ["pino-pretty"] })],
  banner: {
    js: [
      `import { createRequire } from 'module';`,
      `const require = createRequire(import.meta.url);`,
      `import { fileURLToPath } from 'url';`,
      `import { dirname } from 'path';`,
      `const __filename = fileURLToPath(import.meta.url);`,
      `const __dirname = dirname(__filename);`,
    ].join("\n"),
  },
});
