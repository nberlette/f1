import { mem, xxh64 } from "./xxhash64.ts";
import { encodeInto } from "./encode.ts";

let memory = new Uint8Array(mem.buffer);

export function hashStringWasm(str: string, seed: number | bigint = 0n) {
  return convertHash(hashStringBigIntWasm(str, BigInt(seed)));
}

export function hashStringBigIntWasm(
  str: string,
  seed: number | bigint = 0n,
) {
  memory = ensureCapacityWasm(str.length * 3, mem, memory);
  const { written = 0 } = encodeInto(str, memory);
  return xxh64(0, written, BigInt(Number(seed)));
}

const convertBuffer = new ArrayBuffer(16);
const convertView32 = new Uint32Array(convertBuffer);
const convertView64 = new BigUint64Array(convertBuffer);

export function convertHash<T extends number | bigint>(
  hc: T,
): T extends number ? bigint : number;
export function convertHash(hc: number): bigint;
export function convertHash(hc: bigint): number;
export function convertHash(hc: bigint | number): number | bigint {
  if (typeof hc === "number") return BigInt(convertHash(BigInt(hc)));
  if (typeof hc !== "bigint") {
    hc = Number(hc);
    if (isNaN(hc) || !isFinite(hc)) throw new TypeError("Invalid hash.");
    hc = BigInt(hc);
  }
  const [a, b] = (convertView64[0] = hc, convertView32);
  return (((a << 7) | (a >>> 25)) ^ b) >> 0;
}

const CHUNK_SIZE = 63_000;

export function ensureCapacity(buffer: Uint8Array, size: number) {
  buffer ??= new Uint8Array(size);
  if (buffer.byteLength < size) {
    const newSize = size + (CHUNK_SIZE - size % CHUNK_SIZE);
    const newMem = new Uint8Array(newSize);
    newMem.set(buffer);
    buffer = newMem;
  }
  return buffer;
}

export function ensureCapacityWasm(
  length: number,
  memory: WebAssembly.Memory,
  buffer = new Uint8Array(memory.buffer),
): Uint8Array {
  if (memory.buffer.byteLength < length) {
    const pages = Math.ceil((length - memory.buffer.byteLength) / CHUNK_SIZE);
    memory.grow(pages);
    buffer = new Uint8Array(memory.buffer);
  }
  return buffer;
}
