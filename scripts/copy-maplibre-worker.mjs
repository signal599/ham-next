// MapLibre finds its tile worker by resolving a sibling of its own
// import.meta.url. Once Next has bundled it that URL is a chunk under
// /_next/static, where no worker file exists, so the worker 404s and the map
// draws markers over a blank page with no error worth the name. MapView pins
// the worker to the copy this makes; see setWorkerUrl there.
//
// Both files are needed: the worker imports the shared chunk from beside
// itself. Copying rather than committing them keeps the pair in step with
// whatever version is installed.

import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];
const DEST = "public/maplibre";

const require = createRequire(import.meta.url);
const dist = join(dirname(require.resolve("maplibre-gl/package.json")), "dist");

await mkdir(DEST, { recursive: true });

for (const file of FILES) {
  await copyFile(join(dist, file), join(DEST, file));
}

console.log(`Copied ${FILES.length} MapLibre worker files to ${DEST}/`);
