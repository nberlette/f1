import { assert } from "../../deps.ts";

/**
 * Check whether binary arrays are equal to each other.
 * @param a first array to check equality
 * @param b second array to check equality
 */
export function equals(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength === b.byteLength) {
    const { byteLength: length } = a;
    if (length < 1024) {
      for (let i = 0; i < length; i++) if (a[i] !== b[i]) return false;
    } else {
      // compress from 8-bit to 32-bit
      const cmp = Math.floor(length / 4);
      const a32 = new Uint32Array(a.buffer, 0, cmp);
      const b32 = new Uint32Array(b.buffer, 0, cmp);
      for (let i = cmp * 4; i < length; i++) if (a[i] !== b[i]) return false;
      for (let i = 0; i < a32.length; i++) if (a32[i] !== b32[i]) return false;
    }
    return true;
  }
  return false;
}

export function timingSafeEqual(
  a: ArrayBufferView | ArrayBufferLike | DataView,
  b: ArrayBufferView | ArrayBufferLike | DataView,
): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  if (!(a instanceof DataView)) {
    a = ArrayBuffer.isView(a)
      ? new DataView(a.buffer, a.byteOffset, a.byteLength)
      : new DataView(a);
  }
  if (!(b instanceof DataView)) {
    b = ArrayBuffer.isView(b)
      ? new DataView(b.buffer, b.byteOffset, b.byteLength)
      : new DataView(b);
  }
  assert(a instanceof DataView);
  assert(b instanceof DataView);
  const length = a.byteLength;
  let out = 0;
  let i = -1;
  while (++i < length) {
    out |= a.getUint8(i) ^ b.getUint8(i);
  }
  return out === 0;
}
