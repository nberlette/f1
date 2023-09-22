export function pad(
  n: string | number | bigint,
  maxLength = 2,
  fillString = "0",
  padEnd = false,
): string {
  return String(n)[padEnd ? "padEnd" : "padStart"](maxLength, fillString);
}

const sizeFormatter = new Intl.NumberFormat("en", {
  unitDisplay: "narrow",
  unit: "byte",
  notation: "compact",
  signDisplay: "exceptZero",
  style: "unit",
});

type NumericStringBuilder<
  N extends number,
  V extends number = number,
  A extends readonly unknown[] = [],
  T extends string = "",
> = A["length"] extends N ? T
  : NumericStringBuilder<N, V, [0, ...A], `${T}${V}`>;

type NumericString<N extends number = 1, V extends number = number> = N extends
  0 ? never
  : number extends N ? string
  : NumericStringBuilder<N, V> extends infer R extends string ? R
  : never;

declare const kString: unique symbol;

type strings = string & { readonly [kString]?: never };

const makeDefaultDict = ({ now = new Date() } = {}) => ({
  Y: now.getUTCFullYear().toString() as NumericString<4> | strings,
  YYYY: now.getUTCFullYear().toString() as NumericString<4> | strings,
  YY: now.getUTCFullYear().toString().slice(2) as NumericString<2> | strings,
  M: (now.getUTCMonth() + 1).toString() as NumericString<1> | strings,
  MM: pad(now.getUTCMonth() + 1) as NumericString<2> | strings,
  m: (now.getUTCMonth() + 1).toString() as NumericString<1 | 2> | strings,
  DD: pad(now.getUTCDate()) as NumericString<2> | strings,
  D: now.getUTCDate().toString() as NumericString<1 | 2> | strings,
  d: now.getUTCDate().toString() as NumericString<1 | 2> | strings,
  hh: pad(now.getUTCHours() % 12) as NumericString<2> | strings,
  HH: pad(now.getUTCHours()) as NumericString<2> | strings,
  a: `${now.getUTCHours() < 12 ? "am" : "pm"}` as "am" | "pm" | strings,
  A: `${now.getUTCHours() < 12 ? "AM" : "PM"}` as "AM" | "PM" | strings,
  mm: pad(now.getUTCMinutes()) as NumericString<2> | strings,
  s: (now.getTime() / 1000).toFixed(0) as NumericString<1 | 2 | 3> | strings,
  ss: pad(now.getUTCSeconds()) as NumericString<2> | strings,
  sss: pad(now.getUTCMilliseconds(), 3).slice(0, 3) as
    | NumericString<3>
    | strings,
  Z: now.getTimezoneOffset().toString(),
  S: now.getTime().toString() as NumericString<1> | strings,
  t: now.getTime().toString() as NumericString<1> | strings,
  os: Deno.build.os,
  arch: Deno.build.arch,
  user: Deno.env.get("USER") ?? Deno.env.get("USERNAME") ?? "",
  home: Deno.env.get("HOME") ?? Deno.env.get("USERPROFILE") ?? Deno.cwd(),
  uid: Deno.uid()?.toString(),
  gid: Deno.gid()?.toString(),
  cwd: Deno.cwd(),
  version: Deno.version.deno,
  hostname: Deno.hostname(),
});

interface DefaultDict extends Partial<ReturnType<typeof makeDefaultDict>> {
  now?: Date;
  [x: string]: unknown;
}

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
export function string<
  TString extends string,
  const TDict extends DefaultDict = DefaultDict,
>(str: TString, dict?: TDict): string {
  const { now = new Date(), ...substitutions } = dict ?? {};

  return str.replace(
    /[#$%](\w+)|\{{1,2}\s*(\w+)\s*(?:(?<=\{\{\s*\2\s*)\}\}|(?<=(?<!\{)\{\s*\2\s*)\}(?!\}))/gi,
    function replace($0: string, $1: string | undefined, $2: string) {
      return ({
        ...makeDefaultDict({ now }),
        ...substitutions,
      } as const)[$1 ?? $2] ?? $0;
    },
  ).replace(/%%/g, "%");
}

/** Format a raw numeric filesize value into a nice, human-readable string. */
export function bytes(bytes: number): string {
  return sizeFormatter.format(bytes);
}
