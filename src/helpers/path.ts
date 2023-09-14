export function dirname(path: string): string {
  return path.replace(/\/[^\/]+$/, "");
}

export function basename(path: string): string {
  return path.replace(/.*\//, "");
}
