/*!
  64-bit WASM Implementation of Yann Collet's xxHash algorithm.
  
  xxHash Copyright Info
  ---------------------
  Copyright (c) 2012-2021 Yann Collet. All rights reserved.
  BSD 2-Clause License. See https://github.com/Cyan4973/xxHash/blob/dev/LICENSE
*/
/// <reference lib="deno.window" />

export const { xxh64, mem } = (await WebAssembly.instantiateStreaming(
  fetch(
    "data:application/wasm;base64,AGFzbQEAAAABCAFgA39/fgF+AwIBAAUDAQABBw8CA21lbQIABXh4aDY0AAAKggYB/wUCA34BfyAAIAFqIQYgAUEgTwR+IAZBIGshBiACQtbrgu7q/Yn14AB8IQMgAkKxqazBrbjUpj19IQQgAkL56tDQ58mh5OEAfCEFA0AgAyAAKQMAQs/W077Sx6vZQn58Qh+JQoeVr6+Ytt6bnn9+IQMgBCAAQQhqIgApAwBCz9bTvtLHq9lCfnxCH4lCh5Wvr5i23puef34hBCACIABBCGoiACkDAELP1tO+0ser2UJ+fEIfiUKHla+vmLbem55/fiECIAUgAEEIaiIAKQMAQs/W077Sx6vZQn58Qh+JQoeVr6+Ytt6bnn9+IQUgBiAAQQhqIgBPDQALIAJCDIkgBUISiXwgBEIHiXwgA0IBiXwgA0LP1tO+0ser2UJ+Qh+JQoeVr6+Ytt6bnn9+hUKHla+vmLbem55/fkKdo7Xqg7GNivoAfSAEQs/W077Sx6vZQn5CH4lCh5Wvr5i23puef36FQoeVr6+Ytt6bnn9+Qp2jteqDsY2K+gB9IAJCz9bTvtLHq9lCfkIfiUKHla+vmLbem55/foVCh5Wvr5i23puef35CnaO16oOxjYr6AH0gBULP1tO+0ser2UJ+Qh+JQoeVr6+Ytt6bnn9+hUKHla+vmLbem55/fkKdo7Xqg7GNivoAfQUgAkLFz9my8eW66id8CyABrXwhAiAAIAFBH3FqIQEDQCABIABBCGpPBEAgACkDAELP1tO+0ser2UJ+Qh+JQoeVr6+Ytt6bnn9+IAKFQhuJQoeVr6+Ytt6bnn9+Qp2jteqDsY2K+gB9IQIgAEEIaiEADAELCyAAQQRqIAFNBEAgAiAANQIAQoeVr6+Ytt6bnn9+hUIXiULP1tO+0ser2UJ+Qvnz3fGZ9pmrFnwhAiAAQQRqIQALA0AgACABSQRAIAIgADEAAELFz9my8eW66id+hUILiUKHla+vmLbem55/fiECIABBAWohAAwBCwsgAiACQiGIhULP1tO+0ser2UJ+IgJCHYggAoVC+fPd8Zn2masWfiICQiCIIAKFCw==",
  ),
)).instance.exports as {
  readonly mem: WebAssembly.Memory;
  xxh64(byteOffset: number, byteLength: number, seed: bigint): bigint;
};
