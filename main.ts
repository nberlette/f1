#!/usr/bin/env -S deno run --unstable -q --allow-read=assets --allow-write=assets --allow-net=deno.land,oxblue.com --allow-env=DENO_KV_PATH,GITHUB_OUTPUT,GITHUB_ENV,DEBUG,BASEDIR

if (import.meta.main) {
  await import("./src/scrape.ts").then((m) => m.scrape());
}
