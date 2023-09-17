import { inspect } from "../deps.ts";
import {
  ATTEMPTS,
  BASEDIR,
  DELAY,
  FILENAME,
  IMAGE_URL,
  LATEST,
  PATHNAME,
  TEXT,
} from "./constants.ts";
import { debug, fmt, mkdir, setOutput, sleep } from "./helpers.ts";
import { Image } from "./image.ts";

const TRY = {
  read: 0,
  write: 0,
  max: ATTEMPTS,
  get failed() {
    return this.read >= this.max || this.write >= this.max;
  },
};

export async function scrape() {
  const now = new Date();
  const dir = fmt.string(`${BASEDIR}/${PATHNAME}`, { now });
  const file = fmt.string(FILENAME, { now });
  const path = `${dir}/${file}`.replace(/[^a-z0-9-_./]/gi, "");

  const latestPath = `${BASEDIR}/${LATEST}` as const;
  const latest = await Image.fromFile(latestPath, true);

  debug("SCRAPE");
  debug({ now, dir, file, path, latestPath, latest });

  mkdir(dir);

  /** Fetches the latest image data as a Uint8Array. */
  async function read(url: string): Promise<Image> {
    try {
      const res = await fetch(`${url}?ts=${Date.now()}`);
      const image = await Image.fromStream(res.body!);
      debug("scrape.read(): incoming image");
      debug(image);
      return image;
    } catch {
      if (++TRY.read >= TRY.max) {
        throw new Error(
          fmt.string(TEXT.error, {
            message: "Scrape failed. Unable to fetch image.",
            color: 91,
          }),
        );
      }
      debug("scrape.read(): retrying...");
      debug(TRY);
      const attempts = TRY.max - TRY.read;
      // const factor = Math.max(16, 1 << TRY.read);
      console.log(
        fmt.string(TEXT.retry, {
          label: "FETCH ERROR",
          time: 1,
          attempts,
        }),
      );
      return await sleep(1000, read, url);
    }
  }

  /** Writes the image data to `./assets` and symlinks `latest.jpg` */
  async function write(img: Image): Promise<void> {
    const size = img.size;

    if (img.equals(latest)) {
      debug("scrape.write(): image unchanged...");
      if (++TRY.write >= TRY.max) {
        throw new Error(
          fmt.string(TEXT.error, {
            message: "Scrape failed. Image unchanged.",
            color: 91,
          }),
        );
      }

      debug("scrape.write(): updating timestamp on latest image...");
      await Deno.utime(latestPath, now, now);

      const time = Math.floor(DELAY / 1e3);
      const attempts = TRY.max - TRY.write;
      console.log(
        fmt.string(TEXT.retry, { label: "UNCHANGED", time, attempts }),
      );

      debug("scrape.write(): retrying...");
      return await sleep(DELAY, scrape);
    }

    debug("scrape.write(): write");
    await img.write(); // KV
    console.log(
      fmt.string(TEXT.created, {
        path: inspect(img.key, { colors: true, compact: true }),
        size: fmt.bytes(img.size),
        color: 92,
      }),
    );

    debug("scrape.write(): write file");
    await img.writeFile(path); // FS
    console.log(
      fmt.string(TEXT.wrote, {
        path,
        size: fmt.bytes(size),
        color: 92,
      }),
    );

    debug("scrape.write(): write latest");
    await img.writeFile(latestPath); // FS
    const diff = size - latest.byteLength;

    console.log(fmt.string(TEXT.updated, {
      path: latestPath,
      diff: fmt.bytes(diff),
      arrow: diff < 0 ? "↓" : "↑",
      color: diff < 0 ? 91 : 92,
    }));

    debug("scrape.write(): set output");
    setOutput("filename", path);
    setOutput("size", size + "");
    setOutput("diff", diff + "");
    setOutput("timestamp", img.date.toJSON());
    setOutput("hash", img.hash);
    setOutput("key", JSON.stringify(img.key));
  }

  debug("scrape.read(" + IMAGE_URL + ")");
  const image = await read(IMAGE_URL);

  debug("scrape.write(", image, ")");
  await write(image);
}
