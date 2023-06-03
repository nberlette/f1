#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --unstable

async function read(
  url: string,
  errorPrefix = "Read failure",
): Promise<Uint8Array> {
  const init: RequestInit = {
    mode: "cors",
    method: "GET",
    cache: "no-cache",
    redirect: "follow",
    headers: {
      "Accept": "image/*;1.0",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    },
    keepalive: true,
  };

  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(
      `${errorPrefix}: HTTP ${response.status} - ${
        response.statusText ?? "Unknown error"
      }`,
    );
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function write(
  filename: string,
  data: Uint8Array,
  errorPrefix = "Write failure",
): Promise<null | string> {
  filename = filename.replace(/\\/g, "/").replace(/\/{2,}/g, "/").replace(
    /\/$/,
    "",
  ).replace(/^\//, "./").replace(/[^a-z0-9-_./]/gi, "");

  try {
    await Deno.writeFile(filename, data);
    return null;
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      return `${errorPrefix}: insufficient permissions.`;
    } else if (error instanceof Deno.errors.InvalidData) {
      return `${errorPrefix}: invalid input data.`;
    } else if (error instanceof Deno.errors.NotFound) {
      // create the folder and attempt to write again
      try {
        const dirname = filename.split(/(?<=\w)\/(?=\w)/).slice(0, -1).join(
          "/",
        );
        await Deno.mkdir(dirname, { recursive: true, mode: 0o777 });
      } catch (error) {
        return `${errorPrefix}: destination folder missing and cannot be created. Make sure you have the required permissions.\n\n${error}`;
      } finally {
        return await write(filename, data, errorPrefix);
      }
    } else {
      return `${errorPrefix}: ${String(error)}\n\n${error.stack ?? ""}`;
    }
  }
}

const fmt = (n: number | bigint | string) =>
  Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
    maximumSignificantDigits: 6,
    minimumSignificantDigits: 2,
    notation: "compact",
    signDisplay: "exceptZero",
  }).format(Number(n));

async function main() {
  const dir = "./assets";
  const url =
    `https://oxblue.com/archive/a4ed2c099b4f3d942fd3d69702cd6d6b/1024x768.jpg?ts=${+new Date()}` as const;

  const data: Uint8Array = await read(url);

  const name = new Date().toJSON().replace(/:/g, "_").replace(/\..*$/, "");
  const file = `${dir}/${name}.jpg`;

  const info: string | null = await write(file, data);
  if (info) throw new Error(info);

  const size = data.byteLength;
  console.log(`✅ Wrote ${fmt(size)} B → ${file}`);

  await Deno.copyFile(file, `${dir}/latest.jpg`);
  console.log(`✅ Copied ${file} → ${dir}/latest.jpg`);
}

if (import.meta.main) await main();
