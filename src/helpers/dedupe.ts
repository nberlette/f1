import { Image } from "../image.ts";

export const table = new Map<string, string>();

const seen = new Set<string>();

export async function dedupe(path: string | URL) {
  let img: Image | null = null;

  for await (const item of Deno.readDir(path)) {
    if (item.isDirectory) {
      await dedupe(`${path}/${item.name}`);
    } else if (item.isFile) {
      if (item.name.endsWith(".jpg")) {
        if (item.name === "latest.jpg") continue;
        const pathname = `${path}/${item.name}`;
        try {
          img = await Image.fromFile(pathname);
          const hash = Image.hash(img.data!);
          if (seen.has(hash)) {
            console.log(`🗑️ removed duplicate image ${pathname}`);
            await Deno.remove(pathname);
          } else {
            seen.add(hash);
          }
          img = undefined!;
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }

  // Image.folderName = _oldFolderName;
}
