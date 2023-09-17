const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

/** Converts strings to Uint8Array using {@link TextEncoder} API. */
export const encode = encoder.encode.bind(encoder);

/** Zero-copy version of {@link encode}, writes to an existing buffer. */
export const encodeInto = encoder.encodeInto.bind(encoder);

/** Decode a string from a `BufferSource`, optionally by streaming input. */
export const decode = decoder.decode.bind(decoder);
