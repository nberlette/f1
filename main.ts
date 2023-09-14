#!/usr/bin/env -S deno run --allow-all --unstable

if (import.meta.main) {
  await import("./src/scrape.ts").then(({ scrape }) => scrape());
}
