#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --unstable

const url =
  "https://oxblue.com/archive/a4ed2c099b4f3d942fd3d69702cd6d6b/1024x768.jpg";
const time = new Date().toJSON();
// the directory to store the images in
const dir = "./assets";
// the timestamped filename to store the image in
const file = `${dir}/${time.replace(/:/g, "_").replace(/\..*$/, "")}.jpg`;
// the symlink destination for the latest image
const latest = `${dir}/latest.jpg`;

/** Fetches the latest image data as a Uint8Array. */
async function read(url: string) {
  const res = await fetch(`${url}?ts=${+new Date()}`);
  const { ok, status, statusText } = res;
  if (ok) return new Uint8Array(await res.arrayBuffer());

  throw new Error(
    `Read failure: HTTP ${status} - ${statusText ?? "Unknown error"}`,
  );
}

/** Writes the image data to `./assets` and symlinks `latest.jpg` */
async function write(data: Uint8Array): Promise<void> {
  const filename = file.replace(/[\/\\]+/g, "/").replace(/[^a-z0-9-_./]/gi, "");
  const size = data.byteLength;

  const fmt = new Intl.NumberFormat("en", {
    unitDisplay: "narrow",
    unit: "byte",
    notation: "compact",
    signDisplay: "exceptZero",
    style: "unit",
  });

  try {
    await Deno.writeFile(filename, data);
    console.log(
      `🆕 Created ${filename} (\x1b[92m${fmt.format(size)}\x1b[0m)`,
    );
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(file.replace(/[^\/]+$/, ""), { recursive: true });
      return await write(data); // try again
    } else throw error;
  } finally {
    // only create a symlink if the filesize is different from the last one
    const { size: last } = await Deno.stat(latest).catch(() => ({ size: 0 }));
    const diff = size - last;

    if (diff) {
      Deno.chdir(dir);
      await Deno.symlink(
        filename.replace(`${dir}/`, ""),
        latest.replace(`${dir}/`, ""),
      ).then(() => {
        console.log(
          `🔗 ${filename} → ${latest} (\x1b[${diff < 0 ? 91 : 92}m${
            fmt.format(diff)
          } \x1b[1m${diff < 0 ? "↓ smaller" : "↑ larger"}\x1b[0m)`,
        );
      }).catch(() => {});
    }
  }
}

if (import.meta.main) await read(url).then(write);
