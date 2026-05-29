import * as esbuild from "esbuild";
import { mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, "src");
const outDir = join(__dirname, "dist");

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

async function build() {
  await esbuild.build({
    entryPoints: [
      join(srcDir, "content.ts"),
      join(srcDir, "background.ts"),
      join(srcDir, "popup.ts"),
    ],
    outdir: outDir,
    bundle: true,
    minify: true,
    sourcemap: false,
    target: "es2022",
    format: "esm",
  });

  console.log("✓ Extension built to dist/");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
