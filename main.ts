#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --unstable

const url = 
  "https://oxblue.com/archive/a4ed2c099b4f3d942fd3d69702cd6d6b/1024x768.jpg";
const dir = "./assets";
const file = `${dir}/${
  new Date().toJSON().replace(/:/g, "_").replace(/\..*$/, "")
}.jpg`;
const latest = `${dir}/latest.jpg`;

async function read(url: string) {
  const res = await fetch(`${url}?ts=${+new Date()}`);
  const { ok, status, statusText } = res;

  if (ok) return new Uint8Array(await res.arrayBuffer());

  throw new Error(
    `Read failure: HTTP ${status} - ${statusText ?? "Unknown error"}`,
  );
}

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
      `🆕 Created ${filename} \x1b[92m(${fmt.format(size)})\x1b[0m`,
    );

    const prev = await Deno.stat(latest);
    const diff = size - prev.size;

    if (diff) {
      // only update latest.jpg if the file size has changed
      await Deno.copyFile(filename, latest);

      console.log(
        `✅ Updated ${latest} \x1b[${diff < 0 ? 91 : 92}m(${
          fmt.format(diff)
        })\x1b[0m`,
      );
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(file.replace(/[^\/]+$/, ""), { recursive: true });
      return await write(data); // try again
    } else throw error;
  }
}

if (import.meta.main) await read(url).then(write);
