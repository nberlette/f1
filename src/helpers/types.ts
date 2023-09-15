export * from "node:util/types";
import { isAnyArrayBuffer, isArrayBufferView } from "node:util/types";

export function isBufferSource(value: unknown): value is BufferSource {
  return isAnyArrayBuffer(value) || isArrayBufferView(value);
}
