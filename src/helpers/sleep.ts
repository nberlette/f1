/**
 * Sleeps for a given number of milliseconds, and then calls the given function
 * with the provided arguments (if any), returning the result.
 */
export async function sleep<T, A extends readonly unknown[]>(
  ms: number,
  fn: (...args: A) => T | Promise<T>,
  ...args: A
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return await fn(...args);
}
