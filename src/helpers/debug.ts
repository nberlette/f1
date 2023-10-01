export const DEBUG = Boolean(Deno.env.get("DEBUG"));

export const debug = (...args: unknown[]) => {
  if (DEBUG) console.log("[DEBUG]", ...args);
};
