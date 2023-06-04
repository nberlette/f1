#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --unstable

async function read(url: string, prefix = "Read failure") {
  const res = await fetch(url);
  const { ok, status, statusText } = res;

  if (ok) return new Uint8Array(await res.arrayBuffer());

  throw new Error(
    `${prefix}: HTTP ${status} - ${statusText ?? "Unknown error"}`,
  );
}

async function write(file: string, data: Uint8Array): Promise<void> {
  file = file.replace(/[\/\\]+/g, "/").replace(/[^a-z0-9-_./]/gi, "");

  try {
    await Deno.writeFile(file, data);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(file.replace(/[^\/]+$/, ""), { recursive: true });
      return await write(file, data);
    }
    throw error;
  }
}

async function main() {
  // deno-fmt-ignore
  const url = `https://oxblue.com/archive/a4ed2c099b4f3d942fd3d69702cd6d6b/1024x768.jpg?ts=${+new Date()}`;

  const dir = "./assets";
  const file = `${dir}/${
    new Date().toJSON().replace(/:/g, "_").replace(/\..*$/, "")
  }.jpg`;

  const data = await read(url);

  await write(file, data);

  const fmt = (n: number | bigint | string) =>
    Intl.NumberFormat("en", {
      maximumFractionDigits: 2,
      maximumSignificantDigits: 6,
      minimumSignificantDigits: 2,
      notation: "compact",
      signDisplay: "exceptZero",
    }).format(Number(n));

  console.log(`🆕 Wrote ${fmt(data.byteLength)} B → ${file}`);

  await Deno.copyFile(file, `${dir}/latest.jpg`);
  console.log(`✅ Copied ${file} → ${dir}/latest.jpg`);
}

if (import.meta.main) await main();
