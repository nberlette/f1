import { Image } from "../image.ts";

export const table = new Map<string, string>();
export const dupes = new Set<string>();

export async function dedupe(path: string | URL) {
  const _oldFolderName = Image.folderName;

  Image.folderName = path.toString().split(/(?<=[a-z])[/](?=\w+)/i).shift() ??
    "assets";
  for await (const item of Deno.readDir(path)) {
    if (item.isDirectory) {
      await dedupe(`${path}/${item.name}`);
    } else if (item.isFile) {
      if (item.name.endsWith(".jpg")) {
        if (item.name === "latest.jpg") continue;
        let img: Image | null = null;
        try {
          img = await Image.fromFile(`${path}/${item.name}`);
          if (table.has(img.hash) && table.get(img.hash) !== img.path) {
            dupes.add(img.path);
            await img.deleteFile();
            await img.delete();
            console.log(`Deleted duplicate: ${img.path} (${img.hash})`);
            img = null;
            continue;
          } else {
            table.set(img.hash, img.path);
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }

  Image.folderName = _oldFolderName;

  console.log(`✅ found and removed ${dupes.size} duplicate images`);

  return dupes;
}
