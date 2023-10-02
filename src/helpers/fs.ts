import {
  existsSync as exists,
} from "https://deno.land/std@0.203.0/fs/mod.ts";

export * from "https://deno.land/std@0.203.0/fs/mod.ts";

export function link(
  from: string | URL,
  to: string | URL,
  symlink?: boolean,
): boolean {
  try {
    if (exists(to)) Deno.removeSync(to);
    if (symlink) {
      Deno.symlinkSync(from, to);
    } else {
      Deno.link(from.toString(), to.toString());
    }
    return true;
  } catch {
    return false;
  }
}

export function sizeof(path: string | URL): number {
  try {
    const stat = Deno.lstatSync(path);
    return stat.size;
  } catch {
    return 0;
  }
}

export function mkdir(path: string | URL): boolean {
  try {
    Deno.mkdirSync(path, { recursive: true });
    return true;
  } catch {
    return false;
  }
}
