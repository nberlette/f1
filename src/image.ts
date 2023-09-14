// deno-lint-ignore-file no-unused-vars
import {
  inspect,
  type InspectOptions,
  type InspectOptionsStylized,
  readAll,
  readerFromStreamReader,
  writeAll,
  Sha256,
} from "../deps.ts";
import { kv, Blobs } from "./db.ts";
import { exists, timingSafeEqual } from "./helpers.ts";

type TimeStampString =
  | `${number}-${number}-${number}T${number}:${number}:${number}${string}`
  | `${number}-${number}-${number}T${number}_${number}_${number}${string}`;

export type TimeStamp = TimeStampString | number | Date;

/**
 * The {@link Image} API represents a single image scraped from the live feed.
 * It integrates with both the Deno KV data store and the underlying file-system
 * to provide a unified API for reading/writing the image data.
 *
 * This class provides I/O functionality for reading/writing the data to the
 * KV data store as well as the underlying file-system.
 *
 * It's important to note our API's file naming convention. Each image is
 * named after the date and time it was taken, in UTC. The date is used as
 * the folder name, and the time is used as the file name.
 *
 * For example:
 *   - `2023-07-09/12_34_56.jpg` → 2023-07-09 at 12:34:56 UTC
 */
export class Image {
  #uuid = crypto.randomUUID();
  #kv: Deno.Kv = kv;
  #path: string | URL = "./assets";
  #data: ArrayBuffer | null = null;
  #size = 0;
  #date = new Date();
  #latest = false;
  #blobs: Blobs = new Blobs(this.#kv);

  constructor(
    date: Date = new Date(),
    data: BufferSource | null = null,
    path: string | URL | null = null,
    latest = false,
  ) {
    if (data instanceof ArrayBuffer) {
      this.#data = data;
      this.#size = data.byteLength;
    } else if (ArrayBuffer.isView(data)) {
      const { buffer, byteOffset, byteLength } = data;
      this.#data = buffer.slice(byteOffset, byteOffset + byteLength);
      this.#size = byteLength;
    }

    (async () => await this.load())();

    if (date) this.#date = date;
    if (latest) this.#latest = latest;
    if (kv) this.#blobs = new Blobs(this.#kv = kv);
    path ??= Image.folderName;
    this.#path = path.toString().replace(/\/$/, "");
  }

  get uuid(): string {
    return this.#uuid;
  }

  get date(): Date {
    return this.#date;
  }

  get size(): number {
    return this.#size;
  }

  get key(): Deno.KvKey {
    return Image.dateToPath(this.date, this.latest).split(/\//);
  }

  get path(): string {
    return `${this.#path}/${Image.dateToPath(this.date, this.latest)}`;
  }

  get latest(): boolean {
    return this.#latest ??= false;
  }

  get buffer(): ArrayBuffer | null {
    return this.#data;
  }

  get file(): File | null {
    if (this.data == null) return null;
    return new File([this.data], Image.dateToPath(this.date, this.latest), {
      lastModified: this.date.getTime(),
      type: "image/jpeg",
    });
  }

  get data(): Uint8Array | null {
    return this.buffer ? new Uint8Array(this.buffer) : null;
  }

  get byteLength(): number {
    return this.data?.byteLength ?? 0;
  }

  async load(): Promise<this> {
    try {
      if (this.#data == null) {
        const blob = await this.#blobs.get(this.key);
        if (blob) {
          this.#data = blob.buffer.slice(
            blob.byteOffset,
            blob.byteOffset + blob.byteLength,
          );
          this.#size = blob.byteLength;
        }
      } else if (!this.exists()) {
        await this.write();
      }
    } catch { /* ignore */ }
    return this;
  }

  async read(): Promise<Uint8Array> {
    if (this.#data == null) await this.load();
    return new Uint8Array(this.#data! ?? 0);
  }

  async write(): Promise<this> {
    await this.#blobs.set(this.key, await this.read());
    return this;
  }

  async exists(): Promise<boolean> {
    try {
      return (await this.#blobs.get(this.key)) != null;
    } catch {
      return false;
    }
  }

  async delete(): Promise<void> {
    const key = this.key;
    await this.#blobs.remove(key);
  }

  async readFile(path?: string | URL): Promise<Uint8Array> {
    path ??= this.path;
    const file = await Deno.open(path, { read: true });
    const buffer = await readAll(file);
    file.close();
    return buffer;
  }

  async writeFile(path?: string | URL): Promise<this> {
    path ??= this.path;
    const file = await Deno.open(path, {
      create: true,
      write: true,
      truncate: true,
    });
    await writeAll(file, await this.read());
    file.close();
    return this;
  }

  existsFile(path?: string | URL): boolean {
    path ??= this.path;
    return exists(path);
  }

  deleteFile(path?: string | URL): boolean {
    try {
      path ??= this.path;
      Deno.removeSync(path);
      return true;
    } catch {
      return false;
    }
  }

  toJSON() {
    const { date, size, path, key, latest } = this;
    return { date, size, path, key, latest, hash: this.hash() };
  }

  toString(): string {
    return this.path;
  }

  equals(that: Image): boolean;
  equals(that: BufferSource): boolean;
  equals(that: unknown): boolean {
    if (this.data == null) return false;
    const data = new Uint8Array(this.data);
    if (that instanceof Image && that.data !== null) {
      return timingSafeEqual(data, that.data);
    } else if (ArrayBuffer.isView(that)) {
      return timingSafeEqual(
        data,
        new Uint8Array(that.buffer, that.byteOffset, that.byteLength),
      );
    } else if (that instanceof ArrayBuffer) {
      return timingSafeEqual(data, new Uint8Array(that, 0, that.byteLength));
    } else {
      return false;
    }
  }

  hash(digest?: "hex" | undefined): string;
  hash(digest: "array"): number[];
  hash(digest: "buffer"): ArrayBuffer;
  // deno-lint-ignore no-explicit-any
  hash(digest: any = "hex"): string | ArrayBuffer | number[] {
    return Image.hash(this.#data!, digest);
  }

  [inspect.custom](
    depth: number | null,
    options: InspectOptionsStylized,
    inspect: (value: unknown, options: InspectOptions) => string,
  ): string {
    return `${this.constructor.name} ${inspect(this.toJSON(), options)}`;
  }

  static folderName = "assets";

  static dateToPath(date: string | number | Date, latest?: boolean): string {
    let dir = this.folderName, name = "";

    try {
      date = new Date(date);
      const tz = date.getTimezoneOffset();
      date.setTime(date.getTime() - tz * 60 * 1000);
      [dir, name] = date.toISOString().split("T");
      name = name.replace(/:/g, "_").replace(/\..+$/, "");
    } catch {
      if (!latest) throw new TypeError(`Invalid date: ${date}`);
    }
    return latest ? `${this.folderName}/latest.jpg` : `${dir}/${name}.jpg`;
  }

  static pathToDate(path: string | URL, latest?: boolean): Date {
    const [dir, name] = path.toString().split(/\//).slice(-2);
    if (!dir || !name) {
      throw new Error(
        `Invalid image path. The path must contain a minimum of a date-named folder and a time-named file, separated by a forward slash, like so: \`2023-07-09/12_34_56.jpg\`\n\nPath received: ${path} (${typeof path})`,
      );
    }
    const time = name.replace(/\.jpe?g$/, "").replace(/_/g, ":");
    const date = time === "latest" || latest
      ? new Date()
      : new Date(`${dir}T${time}`);
    const tz = date.getTimezoneOffset();
    date.setTime(date.getTime() - tz * 60 * 1000);
    return date;
  }

  static async fromData(
    data: BufferSource,
    date: Date,
    parent?: string | null,
    latest?: boolean,
  ): Promise<Image> {
    const hash = Image.hash(data, "hex");
    const cached = await kv.get<Date>(["hash_to_date", hash]);
    if (cached.value && cached.versionstamp && !latest) {
      return new Image(cached.value, data, parent, latest);
    } else {
      if (!latest) await kv.set(["hash_to_date", hash], date);
      return new Image(date, data, parent, latest);
    }
  }

  static async fromDate(
    date: string | number | Date,
    latest?: boolean,
  ): Promise<Image> {
    const path = Image.dateToPath(date, latest);
    if (exists(path)) return await Image.fromFile(path, latest);
    return new Image(Image.pathToDate(path), null, null, latest);
  }

  static async fromFile(path: string | URL, latest?: boolean): Promise<Image> {
    const date = Image.pathToDate(path, latest);
    const parent = path.toString().split(/\//).slice(0, -2).join("/");
    if (!exists(path)) throw new ReferenceError(`File not found: ${path}`);
    const data = await Deno.readFile(path);

    const img = await Image.fromData(data, date, parent, latest);
    img.#latest = latest ?? path.toString().endsWith("latest.jpg");
    return img;
  }

  static async fromReader(
    reader: Deno.Reader,
    latest?: boolean,
  ): Promise<Image> {
    const data = await readAll(reader);
    return await Image.fromData(data, new Date(), null, latest);
  }

  static async fromStream(
    stream: ReadableStream<Uint8Array>,
    latest?: boolean,
  ): Promise<Image> {
    const reader = readerFromStreamReader(stream.getReader());
    return await Image.fromReader(reader, latest);
  }

  static hash(data: string | BufferSource, digest?: "hex" | undefined): string;
  static hash(data: string | BufferSource, digest: "array"): number[];
  static hash(data: string | BufferSource, digest: "buffer"): ArrayBuffer;
  static hash(data: string | BufferSource, digest?: string) {
    const sha = new Sha256(false, /* is224 */ true /* isSharedMemory */);
    sha.update(ArrayBuffer.isView(data) ? data.buffer : data);
    if (digest === "buffer") return sha.arrayBuffer();
    if (digest === "array") return sha.array();
    return sha.hex();
  }
}
