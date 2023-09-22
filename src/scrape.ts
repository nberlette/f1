import {
  BASEDIR,
  FILENAME,
  IMAGE_URL as url,
  LATEST,
  PATHNAME,
} from "./constants.ts";

import { bytes, dirname, fmt, ln, mkdir, sizeof } from "./helpers.ts";

const now = new Date();

const dir = fmt(`${BASEDIR}/${PATHNAME}`, now);

const file = fmt(FILENAME, now);

const path = `${dir}/${file}`.replace(/[^a-z0-9-_./]/gi, "");

const latest = fmt(`${BASEDIR}/${LATEST}`, now);

/**mm Fetches the latest image data as a Uint8Array. */
export async function read(url: string, cachebuster = +Date.now() + "") {
  const res = await fetch(`${url}?ts=${cachebuster}`);
  const { ok, status, statusText } = res;
  if (ok) return new Uint8Array(await res.arrayBuffer());

  throw new Error(`Scrape failed. Response: HTTP ${status} (${statusText})`);
}

/** Writes the image data to `./assets` and symlinks `latest.jpg` */
export async function write(data: Uint8Array): Promise<void> {
  const size = data.byteLength;

  await mkdir(dirname(path));
  await Deno.writeFile(path, data);

  console.log(
    `🆕 WROTE \x1b[92m${bytes(size)}\x1b[0;2m → \x1b[0;1;4;34m${path}\x1b[0m`,
  );

  const diff = size - await sizeof(latest);
  if (diff != 0) {
    const result = await ln(path, latest);
    if (result) {
      console.log(
        `🔗 LINK ${path} → \x1b[1;4;33m${latest}\x1b[0;2m • \x1b[0;1;${
          diff < 0 ? 91 : 92
        }m${diff < 0 ? "↓" : "↑"} \x1b[1;4m${bytes(diff)}\x1b[0m`,
      );
    }
  }
  // write the new image path to stdout for GitHub Actions to pick up
  console.log(`::set-output name=filename::${path}`);
}

export async function scrape() {
  await read(url).then(write);
}
