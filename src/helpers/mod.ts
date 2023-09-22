export * from "./actions.ts";
export * from "./dedupe.ts";
export * from "./encode.ts";
export * from "./equals.ts";
export * as fmt from "./format.ts";
export * from "./fs.ts";
export * from "./path.ts";
export * from "./sleep.ts";
export * from "./types.ts";

const DEBUG = Boolean(Deno.env.get("DEBUG"));

export const debug = (...args: unknown[]) => {
  if (DEBUG) console.log("[DEBUG]", ...args);
};
