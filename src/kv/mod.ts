import { DENO_KV_PATH } from "../env.ts";
export * from "./reindex.ts";
export * from "./blobs.ts";

export const kv = await Deno.openKv(DENO_KV_PATH);

addEventListener("unload", () => {
  try {
    kv.close();
  } catch { /* ignore */ }
});
