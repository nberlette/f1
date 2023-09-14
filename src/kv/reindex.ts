import { kv } from "./mod.ts";
import { Image } from "../image.ts";
import { sleep } from "../helpers.ts";

onbeforeunload = () => kv.close();

export async function reindex(path: string | URL) {
  path = path.toString().replace(/\/$/, "");

  for await (const item of Deno.readDir(path)) {
    if (item.isDirectory) {
      await reindex(`${path}/${item.name}`);
    } else if (item.isFile) {
      if (item.name.endsWith(".jpg")) {
        if (item.name === "latest.jpg") continue;
        let img: Image | null = null;
        try {
          img = await Image.fromFile(`${path}/${item.name}`);
          await img.write();
        } catch (err) {
          console.error(err);
          // gracefully continue processing
        } finally {
          await sleep(
            5,
            () => {
              console.log(
                `Wrote ${img!.path} to KV (${
                  (img!.size / 1024).toFixed(1)
                } KB)`,
              );
              img = null;
            },
          );
        }
      }
    }
  }
}

if (import.meta.main) await reindex(Deno.args[0]);
