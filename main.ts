#!/usr/bin/env -S deno run --unstable --allow-all
import { scrape } from "./src/scrape.ts";

if (import.meta.main) await scrape();
