import {
  BASEDIR,
  DELAY,
  FILENAME,
  IMAGE_URL,
  LATEST,
  PATHNAME,
} from "./constants.ts";
import { bytes, dirname, fmt, mkdir, setOutput, sleep } from "./helpers.ts";
import { Image } from "./image.ts";

const attempt = { read: 0, write: 0, max: 3 };

export async function scrape() {
  const now = new Date();
  const dir = fmt(`${BASEDIR}/${PATHNAME}`, { now });
  const file = fmt(FILENAME, { now });
  const path = `${dir}/${file}`.replace(/[^a-z0-9-_./]/gi, "");
  const latest = `${BASEDIR}/${LATEST}`;

  /** Fetches the latest image data as a Uint8Array. */
  async function read(
    url: string,
    cachebuster = +Date.now() + "",
  ): Promise<Image> {
    try {
      const res = await fetch(`${url}?ts=${cachebuster}`);
      return await Image.fromStream(res.body!);
    } catch {
      if (attempt.read++ < attempt.max) {
        const tries = attempt.max - attempt.read;
        const factor = Math.max(16, 1 << attempt.read);
        console.log(`⏱️ ERROR · Will retry in ${factor}s \x1b[2m(${tries} attempts remaining)\x1b[0m`);
        return await sleep(1000 * factor, read, url);
      } else {
        throw new Error(`Scrape failed. Unable to fetch image.`);
      }
    }
  }

  /** Writes the image data to `./assets` and symlinks `latest.jpg` */
  async function write(img: Image): Promise<void> {
    const size = img.size;
    const last = await Deno.readFile(latest);

    if (img.equals(last)) {
      if (attempt.write++ >= attempt.max) throw new Error(`Scrape failed. Unable to find fresh content.`);

      Deno.utimeSync(latest, now, now);

      const time = Math.floor(DELAY / 1e3);
      const tries = attempt.max - attempt.write;
      console.log(
        `⏱️ UNCHANGED · Will retry in ${time}s... \x1b[2m(${tries} attempts remaining)\x1b[0m`,
      );

      return await sleep(DELAY, scrape);
    } else {
      mkdir(dirname(path));

      await img.writeFile(path);
      console.log(`🆕 WROTE ${path} \x1b[92m↑ ${fmt.bytes(size)}\x1b[0m`);

      setOutput("filename", path);

      await img.writeFile(latest);
      const diff = size - last.byteLength;
      console.log(
        `🆙 UPDATED \x1b[1;4;33m${latest}\x1b[0;2m \x1b[0;1;${
          diff < 0 ? 91 : 92
        }m${diff < 0 ? "↓" : "↑"} \x1b[4m${bytes(diff)}\x1b[0m`,
      );
    }
  }

  const image = await read(IMAGE_URL);
  await write(image);
}
