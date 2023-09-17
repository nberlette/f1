export function exists(path: string | URL): boolean {
  return sizeof(path) > 0;
}

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
