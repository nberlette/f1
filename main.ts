#!/usr/bin/env -S deno run -A --unstable

import { scrape } from "./src/scrape.ts";

if (import.meta.main) await scrape();
