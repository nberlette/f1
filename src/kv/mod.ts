import { DENO_KV_PATH } from "../env.ts";
export * from "./reindex.ts";
export * from "./blobs.ts";
export * from "./dedupe.ts";

export const kv = DENO_KV_PATH
  ? await Deno.openKv(DENO_KV_PATH)
  : await Deno.openKv();

addEventListener("unload", () => {
  try {
    kv.close();
  } catch { /* ignore */ }
});
