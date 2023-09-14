import { GITHUB_ENV, GITHUB_OUTPUT } from "../constants.ts";
import { encode } from "./encode.ts";

/**
 * Set an output variable for the current action's workflow, preferring the
 * newer `GITHUB_OUTPUT` environment variable over the legacy `::set-output`
 * syntax. If the newer syntax is unavailable, however, it will fall back to
 * using the legacy syntax instead.
 */
export function setOutput(key: string, value: string): boolean {
  const output = GITHUB_OUTPUT;
  value = `${value.replace(/[\r?\n]+$/, "")}\n`;

  try {
    if (output) {
      const file = Deno.openSync(output, { create: true, append: true });
      file.writeSync(encode(`${key}=${value}`));
      file.close();
      return true;
    } else {
      // fallback to legacy output method if GITHUB_OUTPUT is not available
      // NOTE: this is deprecated and will be removed in the future
      Deno.stdout.writeSync(encode(`::set-output name=${key}::${value}`));
      return true;
    }
  } catch {
    return false;
  }
}

/**
 * Set an environment variable for the current action's workflow, preferring
 * the newer `GITHUB_ENV` environment variable over the legacy `::set-env`
 * syntax. If the newer syntax is unavailable, however, it will fall back to
 * using the legacy syntax instead.
 */
export function setEnv(key: string, value: string): boolean {
  const env = GITHUB_ENV;
  value = `${value.replace(/[\r?\n]+$/, "")}\n`;

  try {
    if (env) {
      const file = Deno.openSync(env, { create: true, append: true });
      file.writeSync(encode(`${key}=${value}`));
      file.close();
      return true;
    } else {
      // fallback to legacy env method if GITHUB_ENV is not available
      // NOTE: this is deprecated and will be removed in the future
      Deno.stdout.writeSync(encode(`::set-env name=${key}::${value}`));
      return true;
    }
  } catch {
    return false;
  }
}

/**
 * Sets a state variable for this action's workflow.
 */
export function setState(key: string, value: unknown): boolean {
  value = `${JSON.stringify(value).replace(/[\r?\n]+$/, "")}\n`;

  try {
    const state = Deno.env.get("GITHUB_STATE");
    if (state) {
      const file = Deno.openSync(state, { create: true, append: true });
      file.writeSync(encode(`${key}=${value}`));
      file.close();
      return true;
    } else {
      // fallback to legacy state method if GITHUB_STATE is not available
      // NOTE: this is deprecated and will be removed in the future
      Deno.stdout.writeSync(encode(`::set-state name=${key}::${value}`));
      return true;
    }
  } catch {
    return false;
  }
}
