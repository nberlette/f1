/**
 * Format a filename (or any other string) by replacing a number of different
 * placeholders with their respective values. This is used to generate the
 * image filenames with the current date and time. Aside from date/time tokens,
 * it's also capable of injecting various system-specific values, like username,
 * hostname, PID, OS name/arch, current version of Deno, and so on.
 *
 * @param str The string to format (can contain placeholders)
 * @param [dict] The dictionary of placeholders and their substitutions.
 * @returns the formatted string
 */
export function fmt(
  str: string,
  // deno-lint-ignore no-explicit-any
  dict: { now: Date; [x: string]: any } = { now: new Date() },
): string {
  const { now } = dict;
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

const sizeFormatter = new Intl.NumberFormat("en", {
  unitDisplay: "narrow",
  unit: "byte",
  notation: "compact",
  signDisplay: "exceptZero",
  style: "unit",
});

/** Format a raw numeric filesize value into a nice, human-readable string. */
export function bytes(bytes: number): string {
  return sizeFormatter.format(bytes);
}

/**
 * Format a raw numeric filesize into pretty bytes, using the ES2015 i18n APIs.
 * @alias {@linkcode bytes}
 */
fmt.bytes = bytes;
