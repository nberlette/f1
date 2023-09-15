import { isDataView, isBufferSource } from "./types.ts";

/**
 * Check whether two binary BufferSource objects are equal to each other in
 * constant time, avoiding the possibility of timing-based attacks.
 *
 * @param a first BufferSource to check
 * @param b second BufferSource to check
 * @returns {boolean} whether the two BufferSource objects are equal
 */
export function timingSafeEqual(
  a: BufferSource | DataView,
  b: BufferSource | DataView,
): boolean {
  if (!isBufferSource(a) || !isBufferSource(b)) return false;
  if (a.byteLength !== b.byteLength) return false;
  if (!isDataView(a)) { // if a is not a DataView, make it one
    a = ArrayBuffer.isView(a)
      ? new DataView(a.buffer, a.byteOffset, a.byteLength)
      : new DataView(a);
  }
  if (!isDataView(b)) { // if b is not a DataView, make it one
    b = ArrayBuffer.isView(b)
      ? new DataView(b.buffer, b.byteOffset, b.byteLength)
      : new DataView(b);
  }
  if (!isDataView(a) || !isDataView(b)) {
    throw new TypeError("a and b must be DataView objects by this point");
  }
  let c = 0, i = -1;
  while (++i < a.byteLength) c |= a.getUint8(i) ^ b.getUint8(i);
  return c === 0;
}
