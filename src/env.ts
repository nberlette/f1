// #region GitHub Actions

/** Used for piping outputs to the GitHub Actions workflow. */
export const GITHUB_OUTPUT = Deno.env.get("GITHUB_OUTPUT") || undefined;

/** Used for piping environment variables to the GitHub Actions workflow. */
export const GITHUB_ENV = Deno.env.get("GITHUB_ENV") || undefined;

// #endregion GitHub Actions

// #region Deno KV

/**
 * Sets the path for the persisted database file with the $DENO_KV_PATH
 * environment variable. 
 * 
 * This will be passed to `Deno.openKv` **as is**. This means values of `""` or
 * `undefined` will open the database in the global namespace (backed by SQLite 
 * and FoundationDB in Deno CLI and Deno Deploy, respectively).
 * 
 * This is employed by the GitHub Actions workflow to persist the database in a
 * Deno Deploy KV namespace that is shared across all runs of the workflow.
 * The  
 */
export const DENO_KV_PATH = Deno.env.get("DENO_KV_PATH") || undefined;

// #endregion Deno KV