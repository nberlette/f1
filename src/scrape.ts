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
import { fmt, mkdir, setOutput, sleep } from "./helpers.ts";
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

  const latestPath = `${BASEDIR}/${LATEST}`;
  const latest = await Image.fromFile(latestPath, true);

  mkdir(dir);

  /** Fetches the latest image data as a Uint8Array. */
  async function read(url: string): Promise<Image> {
    try {
      const res = await fetch(`${url}?ts=${Date.now()}`);
      return await Image.fromStream(res.body!);
    } catch {
      TRY.read++;
      if (TRY.failed) {
        throw new Error(
          fmt.string(TEXT.error, {
            message: "Scrape failed. Unable to fetch image.",
            color: 91,
          }),
        );
      }
      const attempts = TRY.max - TRY.read;
      const factor = Math.max(16, 1 << TRY.read);
      console.log(
        fmt.string(TEXT.retry, {
          label: "FETCH ERROR",
          time: factor,
          attempts,
        }),
      );
      return await sleep(1000 * factor, read, url);
    }
  }

  /** Writes the image data to `./assets` and symlinks `latest.jpg` */
  async function write(img: Image): Promise<void> {
    const size = img.size;

    if (img.equals(latest)) {
      TRY.write++;
      if (TRY.failed) {
        throw new Error(
          fmt.string(TEXT.error, {
            message: "Scrape failed. Image unchanged.",
            color: 91,
          }),
        );
      }

      await Deno.utime(latestPath, now, now);

      const time = Math.floor(DELAY / 1e3);
      const attempts = TRY.max - TRY.write;
      console.log(
        fmt.string(TEXT.retry, { label: "UNCHANGED", time, attempts }),
      );

      return await sleep(DELAY, scrape);
    }

    await img.write(); // KV
    console.log(
      fmt.string(TEXT.created, {
        path: inspect(img.key, { colors: true, compact: true }),
        size: fmt.bytes(img.size),
        color: 92,
      }),
    );

    await img.writeFile(path); // FS
    console.log(
      fmt.string(TEXT.wrote, {
        path,
        size: fmt.bytes(size),
        color: 92,
      }),
    );

    await img.writeFile(latestPath); // FS
    const diff = size - latest.size;

    console.log(fmt.string(TEXT.updated, {
      path: latestPath,
      diff: fmt.bytes(diff),
      arrow: diff < 0 ? "↓" : "↑",
      color: diff < 0 ? 91 : 92,
    }));

    setOutput("filename", path);
    setOutput("size", size + "");
    setOutput("diff", diff + "");
    setOutput("timestamp", img.date.toJSON());
    setOutput("hash", img.hash);
    setOutput("key", JSON.stringify(img.key));
  }

  await read(IMAGE_URL).then(write);
}
