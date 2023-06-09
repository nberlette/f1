import { BASEDIR, LATEST } from "./constants.ts";

/** A function that always returns `false`. */
export const F = () => false;

/** A function that always returns `true`. */
export const T = () => true;

/** No-op function. Always returns `void`. */
export const N = () => {};

export const dirname = (path: string) => path.replace(/(.+?)\/[^\/]+$/, "$1");

export const basename = (path: string) => path.replace(/.*\/(.+?)$/, "$1");

export const exists = async (path: string) =>
  await Deno.lstat(path).then((s) => s.size > 0).catch(F);

export const ln = async (from: string, to: string, symlink?: boolean) => {
  if (await exists(to)) await Deno.remove(to).catch(N);
  return await Deno[symlink ? "symlink" : "link"](from, to).then(T).catch(F);
};

export const sizeof = async (path: string) =>
  await Deno.stat(path).then(({ size }) => size).catch(() => 0);

export const mkdir = async (path: string, recursive = true) =>
  await Deno.mkdir(path, { recursive }).then(T).catch(F);

const sizeFormatter = new Intl.NumberFormat("en", {
  unitDisplay: "narrow",
  unit: "byte",
  notation: "compact",
  signDisplay: "exceptZero",
  style: "unit",
});

/** Format a raw numeric filesize value into a nice, human-readable string. */
export function bytes(n: number | bigint): string {
  return sizeFormatter.format(n);
}

/**
 * Format a filename (or any other string) by replacing a number of different
 * placeholders with their respective values. This is used to generate the
 * image filenames with the current date and time. Aside from date/time tokens,
 * it's also capable of injecting various system-specific values, like username,
 * hostname, PID, OS name/arch, current version of Deno, and so on.
 *
 * @param str The string to format (can contain placeholders)
 * @param [now] The date to use for date/time values (defaults to current time)
 * @returns the formatted string
 */
export function fmt(str: string, now = new Date()): string {
  return str.replace(
    /[#$%]([a-z]+\b)|\{{1,2}([a-z]+)\}{1,2}/gi,
    (_: string, c: string, d: string) => ({
      Y: now.getFullYear().toString(),
      YYYY: now.getFullYear().toString(),
      YY: now.getFullYear().toString().slice(2),
      M: (now.getMonth() + 1).toString().padStart(2, "0"),
      MM: (now.getMonth() + 1).toString().padStart(2, "0"),
      m: (now.getMonth() + 1).toString().padStart(2, "0"),
      DD: now.getDate().toString().padStart(2, "0"),
      D: now.getDate().toString().padStart(2, "0"),
      d: now.getDate().toString().padStart(2, "0"),
      hh: (now.getHours() % 12).toString().padStart(2, "0"),
      HH: now.getHours().toString().padStart(2, "0"),
      a: now.getHours() < 12 ? "am" : "pm",
      A: now.getHours() < 12 ? "AM" : "PM",
      mm: now.getMinutes().toString().padStart(2, "0"),
      s: (now.getTime() / 1000).toFixed(0),
      ss: now.getSeconds().toString().padStart(2, "0"),
      sss: now.getMilliseconds().toString().padStart(3, "0").slice(0, 3),
      Z: now.getTimezoneOffset().toString(),
      S: now.getTime().toString(),
      t: now.getTime().toString(),
      ppid: Deno.ppid.toString(),
      pid: Deno.pid.toString(),
      os: Deno.build.os,
      arch: Deno.build.arch,
      user: Deno.env.get("USER") ?? Deno.env.get("USERNAME") ?? "",
      home: Deno.env.get("HOME") ?? "",
      uid: Deno.uid()?.toString(),
      gid: Deno.gid()?.toString(),
      cwd: Deno.cwd(),
      version: Deno.version.deno,
      hostname: Deno.hostname(),
    }[c ?? d] ?? (c ?? d)),
  ).replace(/%%/g, "%").replace(/[/]{2,}/g, "/");
}
