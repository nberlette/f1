// deno-lint-ignore-file no-unused-vars
import {
  inspect,
  type InspectOptions,
  type InspectOptionsStylized,
  readAll,
  readerFromStreamReader,
  Sha256,
  writeAll,
} from "../deps.ts";
import { Blobs, kv } from "./db.ts";
import { timingSafeEqual } from "./helpers/equals.ts";
import { exists } from "./helpers/fs.ts";
import { isArrayBuffer } from "./helpers/types.ts";

type TimeStampString =
  | `${number}-${number}-${number}T${number}:${number}:${number}${string}`
  | `${number}-${number}-${number}T${number}_${number}_${number}${string}`;

export type TimeStamp = TimeStampString | number | Date;

interface SyncedImage extends Image {
  readonly buffer: ArrayBuffer;
  readonly data: Uint8Array;
}

const slashRegExp = /(?<!^|\.{1,2})\/(?!$)/;

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
  /** The name of the folder where the images are stored. */
  static folderName = "assets";

  /** The Deno KV key prefix for the image hash-to-date index. */
  static hashTableKey = ["hash_to_date"];

  /** The name of the file that contains the most recent image. */
  static latestImageName = "latest.jpg";

  #kv: Deno.Kv = kv;
  #path: string | URL = Image.folderName;
  #data: ArrayBuffer | null = null;
  #date = new Date();
  #latest = false;
  #blobs: Blobs = new Blobs(this.#kv);

  constructor(
    date: string | number | Date,
    data: BufferSource | null = null,
    path: string | URL | null = null,
    latest = false,
  ) {
    if (isArrayBuffer(data)) {
      this.#data = data;
    } else if (ArrayBuffer.isView(data)) {
      const { buffer, byteOffset, byteLength } = data;
      this.#data = buffer.slice(byteOffset, byteOffset + byteLength);
    }
    if (kv) this.#blobs = new Blobs(this.#kv = kv);
    if (date) this.#date = new Date(date);
    path ??= Image.folderName;
    this.#path = path.toString().replace(/\/$/, "");
    this.#latest = Boolean(latest);
    (async () => await this.sync())();
  }

  /**
   * The underlying `ArrayBuffer` that contains this image's data. If the
   * image hasn't been loaded yet, this value will be `null`.
   */
  get buffer(): ArrayBuffer | null {
    return this.#data;
  }

  /**
   * The underlying {@link Image.buffer} data wrapped in a `Uint8Array`. If the
   * image hasn't been loaded yet, this value will be `null`.
   */
  get data(): Uint8Array | null {
    return this.buffer ? new Uint8Array(this.buffer) : null;
  }

  /** The timestamp reflecting the time of the image's creation. */
  get date(): Date {
    return this.#date;
  }

  /** The hash of the image's underlying data buffer. */
  get hash(): string {
    return Image.hash(this.#data!, "hex");
  }

  /** The size of the image's underlying data buffer, in bytes. */
  get size(): number {
    return this.#data?.byteLength ?? 0;
  }

  /** An alias for {@link Image.size}, reflecting the image's size. */
  get byteLength(): number {
    return this.data?.byteLength ?? 0;
  }

  /** The key used for persisting the image's data a in Deno KV database. */
  get key(): Deno.KvKey {
    return Image.dateToPath(this.date, this.latest).split(slashRegExp);
  }

  /**
   * The path to the image's `JPEG` file on the file-system.
   *
   * ⚠️ **Note**: this file isn't guaranteed to exist, and may also be relative.
   */
  get path(): string {
    return `${this.#path}/${Image.dateToPath(this.date, this.latest)}`;
  }

  /**
   * Boolean value that indicates whether or not this image is the most recent
   * image in the feed.
   *
   * If `true`, the image will be named `latest.jpg`. Otherwise, the image will
   * be named according to its {@link Image.date} value.
   */
  get latest(): boolean {
    return this.#latest ??= false;
  }

  set latest(value: boolean) {
    this.#latest = Boolean(value);
  }

  /** Synchronizes the image data with the KV store. */
  protected async sync(): Promise<SyncedImage> {
    try {
      if (this.buffer === null) {
        const blob = await this.#blobs.get(this.key);
        const date = await this.#kv.get<Date>([
          ...Image.hashTableKey,
          this.hash,
        ]);

        if (date.value) {
          this.#date.setTime(date.value.getTime());
        } else {
          await this.#kv.set([...Image.hashTableKey, this.hash], this.date);
        }

        if (blob) {
          this.#data = blob.buffer.slice(
            blob.byteOffset,
            blob.byteOffset + blob.byteLength,
          );
        } else {
          throw new ReferenceError(`Blob not found: ${inspect(this.key)}`);
        }
      } else {
        if (!(await this.exists())) await this.write();
      }
    } catch { /* ignore */ }
    // deno-lint-ignore no-explicit-any
    return this as any;
  }

  /** Reads the image's data from the KV store. */
  async read(): Promise<Uint8Array> {
    return await this.sync().then(({ data }) => data);
  }

  /** Writes the image's data to the KV store. */
  async write(): Promise<this> {
    await this.#blobs.set(this.key, await this.read());
    await this.#kv.set([...Image.hashTableKey, this.hash], this.date);
    return this;
  }

  /** Checks whether or not the image's data exists in the KV store. */
  async exists(): Promise<boolean> {
    try {
      return (await this.#blobs.get(this.key)) != null;
    } catch {
      return false;
    }
  }

  /** Deletes the image's data from the KV store. */
  async delete(): Promise<void> {
    const key = this.key;
    await this.#blobs.remove(key);
  }

  /** Reads the file from the file-system, optionally at a custom path. */
  async readFile(path?: string | URL): Promise<Uint8Array> {
    path ??= this.path;
    try {
      const file = await Deno.open(path, { read: true });
      this.#data = await readAll(file).then(({ buffer }) => buffer);
      file.close();
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return await this.writeFile(path).then(({ data }) => data!);
      } else {
        throw error;
      }
    }
    return this.data!;
  }

  /** Write the image to the file-system, optionally at a custom path. */
  async writeFile(
    path?: string | URL,
    options?: { create?: boolean; append?: boolean; truncate?: boolean },
  ): Promise<this> {
    path ??= this.path;
    const write = true;
    const { create = true, truncate = true, append = false } = options ?? {};

    const file = await Deno.open(path, { create, write, truncate, append });
    await writeAll(file, await this.read());
    file.close();

    return this;
  }

  /** Check if an image exists in a file-system, at an optional custom path. */
  fileExists(path?: string | URL): boolean {
    path ??= this.path;
    return exists(path);
  }

  /** Delete the image from the file-system, optionally at a custom path. */
  async deleteFile(path?: string | URL): Promise<boolean> {
    try {
      path ??= this.path;
      await Deno.remove(path);
      return true;
    } catch {
      return false;
    }
  }

  /** Check if the image's data is equal to another image's data. */
  equals(that: Image | BufferSource): boolean {
    if (this.data === null) return false;
    if (that instanceof Image && that.data !== null) {
      return timingSafeEqual(this.data, that.data);
    } else if (ArrayBuffer.isView(that)) {
      return timingSafeEqual(
        this.data,
        new Uint8Array(that.buffer, that.byteOffset, that.byteLength),
      );
    } else if (isArrayBuffer(that)) {
      return timingSafeEqual(
        this.data,
        new Uint8Array(that, 0, that.byteLength),
      );
    } else {
      return false;
    }
  }

  /** Returns a `File` object for the image. */
  toFile(name?: string): File {
    return new File([this.data!], name ?? this.path, {
      type: "image/jpeg",
      lastModified: this.date.getTime(),
      endings: "transparent",
    });
  }

  /** Returns a JSON representation of the image. */
  toJSON() {
    const { date, size, path, key, latest, hash } = this;
    return { date, size, path, key, latest, hash };
  }

  /** Returns the image's file-system path string. */
  toString(): string {
    return this.path;
  }

  protected [inspect.custom](
    depth: number | null,
    options: InspectOptionsStylized,
    inspect: (value: unknown, options: InspectOptions) => string,
  ): string {
    return `${this.constructor.name} ${inspect(this.toJSON(), options)}`;
  }

  /** Converts an image's date to a path string. */
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
    return `${Image.folderName}/${
      latest ? Image.latestImageName : `${dir}/${name}.jpg`
    }`;
  }

  /** Converts an image's path to a date object. */
  static pathToDate(path: string | URL, latest?: boolean): Date {
    const [dir, name] = path.toString().split(slashRegExp).slice(-2);

    if (!dir || !name) {
      throw new Error(
        `Invalid image path. The path must contain a minimum of a date-named folder and a time-named file, separated by a forward slash, like so: \`2023-07-09/12_34_56.jpg\`\n\nPath received: ${path} (${typeof path})`,
      );
    }

    const time = name.replace(/\.jpe?g$/, "").replace(/_/g, ":");
    const date = time === Image.latestImageName.split(".")[0] || latest
      ? new Date()
      : new Date(`${dir}T${time}`);

    const tz = date.getTimezoneOffset();
    date.setTime(date.getTime() + tz * 60 * 1000);

    return date;
  }

  static async fromData(
    data: BufferSource,
    date: Date,
    parent?: string | null,
    latest?: boolean,
  ): Promise<Image> {
    const hash = Image.hash(data, "hex");
    const cached = await kv.get<Date>([...Image.hashTableKey, hash]);
    if (cached.value && cached.versionstamp && !latest) {
      return new Image(cached.value, data, parent, latest);
    } else {
      if (!latest) await kv.set([...Image.hashTableKey, hash], date);
      return new Image(date, data, parent, latest);
    }
  }

  /**
   * Creates a new image from an existing scrape event's timestamp. For this to
   * work as intended, the image must have already been scraped and saved to the
   * underlying file-system or the KV data store.
   */
  static async fromDate(
    date: string | number | Date,
    latest?: boolean,
  ): Promise<Image> {
    const path = Image.dateToPath(date, latest);
    if (exists(path)) return await Image.fromFile(path, latest);
    return new Image(Image.pathToDate(path), null, null, latest);
  }

  /** Creates a new image from a file on the file-system. */
  static async fromFile(path: string | URL, latest?: boolean): Promise<Image> {
    const date = Image.pathToDate(path, latest);
    const parent = path.toString().split(slashRegExp).slice(0, -2).join("/");
    if (!exists(path)) throw new ReferenceError(`File not found: ${path}`);
    const data = await Deno.readFile(path);

    const img = await Image.fromData(data, date, parent, latest);
    img.#latest = latest ?? path.toString().endsWith(Image.latestImageName);
    return img;
  }

  /** Creates a new image from a {@linkcode Deno.Reader} stream. */
  static async fromReader(
    reader: Deno.Reader,
    latest?: boolean,
  ): Promise<Image> {
    const data = await readAll(reader);
    return await Image.fromData(data, new Date(), null, latest);
  }

  /**
   * Creates a new image from a `ReadableStream` of `Uint8Array` data, such as a
   * `Response.body` stream from a `fetch` request.
   */
  static async fromStream(
    stream: ReadableStream<Uint8Array>,
    latest?: boolean,
  ): Promise<Image> {
    const reader = readerFromStreamReader(stream.getReader());
    return await Image.fromReader(reader, latest);
  }

  static hash(data: BufferSource | Image, digest?: "hex" | undefined): string;
  static hash(data: BufferSource | Image, digest: "array"): number[];
  static hash(data: BufferSource | Image, digest: "buffer"): ArrayBuffer;
  static hash(data: BufferSource | Image, digest?: string) {
    const sha = new Sha256(/* is224 */ false, /* isSharedMemory */ true);
    const buffer = data instanceof Image || ArrayBuffer.isView(data)
      ? data.buffer?.slice(0)
      : data;
    sha.update(buffer ?? "");
    if (digest === "buffer") return sha.arrayBuffer();
    if (digest === "array") return sha.array();
    return sha.hex();
  }
}
