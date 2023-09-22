import { timingSafeEqual } from "../helpers.ts";
import { type Atomic, atomic } from "./atomic.ts";

type Key = Deno.KvKeyPart | Deno.KvKeyPart[];

interface GetOptions {
  consistency?: Deno.KvConsistencyLevel | undefined;
  stream?: boolean;
}

interface GetStreamOptions extends GetOptions {
  stream: true;
}

interface SetOptions {
  expireIn?: number;
}

export class Blobs {
  #kv: Deno.Kv;
  #prefix: Deno.KvKey = [];
  #key = (key: Deno.KvKey, suffix?: Key): Deno.KvKey =>
    [...this.#prefix, ...key, ...(suffix ? [suffix].flat() : [])].flat();

  constructor(kv: Deno.Kv, options?: { prefix?: Key }) {
    this.#kv = kv;
    if (options?.prefix) this.#prefix = [options.prefix].flat();
  }

  /**
   * Remove/delete a binary object from the store with a given key that has been
   * {@linkcode Blobs.set}. See also {@linkcode Blobs.get}.
   */
  async remove(key: Deno.KvKey): Promise<void> {
    const prefix = this.#key(key, Blobs.KEY);
    const batchSize = Blobs.BATCH;
    const parts = await Blobs.keys(this.#kv, { prefix }, { batchSize });
    if (parts.length) {
      let op = this.#kv.atomic();
      for (const key of parts) op = op.delete(this.#key(key));
      await op.commit();
    }
  }

  /**
   * Retrieve a binary object from the store with a given key that has been
   * {@linkcode Blobs.set}.
   *
   * When setting the option `stream` to `true`, a {@linkcode ReadableStream} is
   * returned to read the blob in chunks of {@linkcode Uint8Array}, otherwise
   * the function resolves with a single {@linkcode Uint8Array}.
   */
  get(key: Deno.KvKey, options: GetStreamOptions): ReadableStream<Uint8Array>;

  /**
   * Retrieve a binary object from the store with a given key that has been
   * {@linkcode Blobs.set}.
   *
   * When setting the option `stream` to `true`, a {@linkcode ReadableStream} is
   * returned to read the blob in chunks of {@linkcode Uint8Array}, otherwise
   * the function resolves with a single {@linkcode Uint8Array}.
   */
  get(key: Deno.KvKey, options?: GetOptions): Promise<Uint8Array | null>;

  /**
   * Retrieve a binary object from the store with a given key that has been
   * {@linkcode Blobs.set}.
   *
   * When setting the option `stream` to `true`, a {@linkcode ReadableStream} is
   * returned to read the blob in chunks of {@linkcode Uint8Array}, otherwise
   * the function resolves with a single {@linkcode Uint8Array}.
   */
  get(key: Deno.KvKey, options: GetOptions = {}) {
    key = this.#key(key);
    if (options.stream) return Blobs.asStream(this.#kv, key, options);
    return Blobs.asUint8Array(this.#kv, key, options);
  }

  /**
   * Set the blob value in the provided {@linkcode Deno.Kv} with the provided
   * key. The blob can be any array buffer like structure or a byte
   * {@linkcode ReadableStream}.
   *
   * The function chunks up the blob into parts which deno be stored in Deno KV
   * and should be retrieved back out using the {@linkcode get} function.
   *
   * Optionally, an `expireIn` option can be specified to set a time-to-live
   * (TTL) for the key. The TTL is specified in milliseconds, and the key will
   * be deleted from the database at earliest after the specified number of
   * milliseconds have elapsed. Once the specified duration has passed, the
   * key may still be visible for some additional time. If the `expireIn`
   * option is not specified, the key will not expire.
   */
  async set(
    key: Deno.KvKey,
    blob: ArrayBufferLike | ReadableStream<Uint8Array>,
    options?: SetOptions,
  ): Promise<void> {
    const prefix = this.#key(key, Blobs.KEY);
    const items = await Blobs.keys(this.#kv, { prefix });
    key = this.#key(key);
    let op = atomic(this.#kv);
    let count = 0;
    if (blob instanceof ReadableStream) {
      [count, op] = await Blobs.writeStream(op, key, blob, options);
    } else {
      [count, op] = Blobs.writeArrayBuffer(op, key, blob, 0, options);
    }
    op = Blobs.deleteKeys(op, key, count, items.length);
    await op.commit();
  }

  async keys(
    selector: Deno.KvListSelector,
    options?: Deno.KvListOptions,
  ): Promise<Deno.KvKey[]> {
    if ("prefix" in selector) {
      selector.prefix = this.#key(selector.prefix);
    }
    if ("start" in selector) {
      selector.start = this.#key(selector.start);
    }
    if ("end" in selector) {
      selector.end = this.#key(selector.end);
    }
    return await Blobs.keys(this.#kv, selector, options);
  }

  async unique(
    prefix: Deno.KvKey = [],
    options?: Deno.KvListOptions,
  ): Promise<Deno.KvKey[]> {
    return await Blobs.unique(this.#kv, this.#key(prefix), options);
  }

  /**
   * Return an array of keys that match the `selector` in the target `kv`
   * store.
   *
   * ### Example
   *
   * ```ts
   * import { keys } from "https://deno.land/x/kv-tools/keys.ts";
   *
   * const kv = await Deno.openKv();
   * console.log(await keys(kv, { prefix: ["hello"] }));
   * await kv.close();
   * ```
   */
  public static async keys(
    kv: Deno.Kv,
    selector: Deno.KvListSelector,
    options?: Deno.KvListOptions,
  ): Promise<Deno.KvKey[]> {
    const list = kv.list(selector, options);
    const keys: Deno.KvKey[] = [];
    for await (const { key } of list) keys.push(key);
    return keys;
  }

  /**
   * Resolves with an array of unique sub keys/prefixes for the provided prefix.
   *
   * This is useful when storing keys and values in a hierarchical/tree view,
   * where you are retrieving a list and you want to know all the unique
   * _descendents_ of a key in order to be able to enumerate them.
   *
   * For example if you had the following keys stored in a datastore:
   *
   * ```ts
   * ["a", "b"]
   * ["a", "b", "c"]
   * ["a", "d", "e"]
   * ["a", "d", "f"]
   * ```
   *
   * And you would get the following results when using `unique()`:
   *
   * ```ts
   * import { unique } from "https://deno.land/x/kv-tools/keys.ts";
   *
   * const kv = await Deno.openKv();
   * console.log(await Blobs.unique(kv, ["a"]));
   * // ["a", "b"]
   * // ["a", "d"]
   * await kv.close();
   * ```
   *
   * If you omit a `prefix`, all unique root keys are resolved.
   */
  public static async unique(
    kv: Deno.Kv,
    prefix: Deno.KvKey = [],
    options?: Deno.KvListOptions,
  ): Promise<Deno.KvKey[]> {
    const list = kv.list({ prefix }, options);
    const prefixLength = prefix.length;
    const prefixes = new Set<Deno.KvKeyPart>();

    for await (const { key } of list) {
      if (key.length <= prefixLength) {
        throw new TypeError(`Unexpected key length of ${key.length}.`);
      }
      const part = key[prefixLength];
      if (ArrayBuffer.isView(part)) {
        this.addIfUnique(prefixes, part);
      } else {
        prefixes.add(part);
      }
    }

    return [...prefixes].map((part) => [...prefix, part]);
  }

  static readonly BATCH = 10;
  static readonly CHUNK = 63_000;
  static KEY = "__BLOB__";

  protected static asStream(kv: Deno.Kv, key: Deno.KvKey, options: {
    consistency?: Deno.KvConsistencyLevel | undefined;
  }): ReadableStream<Uint8Array> {
    let list: Deno.KvListIterator<Uint8Array> | null = null;
    return new ReadableStream({
      type: "bytes",
      autoAllocateChunkSize: Blobs.CHUNK,
      async pull(controller) {
        if (!list) return controller.error(new Error("KV List not set"));
        const next = await list.next();
        const { value } = next.value ?? {};
        if (value) {
          if (ArrayBuffer.isView(value)) {
            controller.enqueue(value);
          } else {
            controller.error(new TypeError("KV value is not a Uint8Array."));
          }
        }
        if (next.done) controller.close();
      },
      start() {
        list = kv.list<Uint8Array>({ prefix: [...key, Blobs.KEY] }, {
          ...options,
          batchSize: Blobs.BATCH,
        });
      },
    });
  }

  protected static async asUint8Array(
    kv: Deno.Kv,
    key: Deno.KvKey,
    options: { consistency?: Deno.KvConsistencyLevel | undefined },
  ): Promise<Uint8Array | null> {
    const list = kv.list<Uint8Array>({ prefix: [...key, Blobs.KEY] }, {
      ...options,
      batchSize: Blobs.BATCH,
    });
    let found = false;
    let value = new Uint8Array();
    for await (const item of list) {
      if (item.value) {
        found = true;
        if (!ArrayBuffer.isView(item.value)) {
          throw new TypeError("KV value is not an ArrayBufferView.");
        }
        const v = new Uint8Array(value.length + item.value.byteLength);
        v.set(value, 0);
        v.set(item.value, value.length);
        value = v;
      }
    }
    return found ? value : null;
  }

  protected static deleteKeys(
    op: Atomic,
    key: Deno.KvKey,
    count: number,
    length: number,
  ): Atomic {
    while (++count <= length) op.delete([...key, Blobs.KEY, count]);
    return op;
  }

  protected static writeArrayBuffer(
    op: Atomic,
    key: Deno.KvKey,
    blob: ArrayBufferLike,
    start = 0,
    options?: { expireIn?: number },
  ): [count: number, operation: Atomic] {
    const buffer = new Uint8Array(blob);
    let offset = 0;
    let count = start;
    while (buffer.byteLength > offset) {
      count++;
      const chunk = buffer.subarray(offset, offset + Blobs.CHUNK);
      op.set([...key, this.KEY, count], chunk, options);
      offset += Blobs.CHUNK;
    }
    return [count, op];
  }

  protected static async writeStream(
    op: Atomic,
    key: Deno.KvKey,
    stream: ReadableStream<Uint8Array>,
    options?: { expireIn?: number },
  ): Promise<[count: number, operation: Atomic]> {
    let start = 0;
    for await (const chunk of stream) {
      [start, op] = Blobs.writeArrayBuffer(op, key, chunk, start, options);
    }
    return [start, op];
  }

  protected static addIfUnique(set: Set<Deno.KvKeyPart>, item: Uint8Array) {
    for (const i of set) {
      if (ArrayBuffer.isView(i) && timingSafeEqual(i, item)) return;
    }
    set.add(item);
  }
}
