// #region Deno KV

/**
 * Set the path for the persisted database file with the $DENO_KV_PATH
 * environment variable. This will be passed to `Deno.openKv` as is, so `""` or
 * `undefined` will open the database in the global namespace (backed by SQLite
 * in Deno CLI environments, or FoundationDB when in Deno Deploy environments).
 * It also supports `:memory:` for an in-memory instance, just like SQLite.
 */
export const DENO_KV_PATH = Deno.env.get("DENO_KV_PATH") || undefined;

/**
 * The batch size used during batched atomic operations with blob data.
 * @default {10}
 */
export const BATCH_SIZE = 10;

/**
 * The maximum chunk size (in bytes) for binary file data. Any incoming binary
 * data that exceeds this byte length will be processed via the blob algorithm.
 * Currently, Deno KV only supports values of ~63KB per entry, hence the value
 * being `63_000`.
 */
export const CHUNK_SIZE = 63_000;

/** The identifying key used to tag a partial chunk of a blob data. */
export const BLOB_KEY = "__BLOB__";

// #endregion Deno KV

// #region GitHub Actions

/** Used for piping outputs to the GitHub Actions workflow. */
export const GITHUB_OUTPUT = Deno.env.get("GITHUB_OUTPUT") || undefined;

/** Used for piping environment variables to the GitHub Actions workflow. */
export const GITHUB_ENV = Deno.env.get("GITHUB_ENV") || undefined;

// #endregion GitHub Actions

// #region F1 Scraper

/** DO NOT CHANGE THIS */
const BASE_URL = "https://oxblue.com/archive/a4ed2c099b4f3d942fd3d69702cd6d6b";

/** The size of the image to scrape. */
export const IMAGE_SIZE = "1024x768";

/** The endpoint URL for the live photo stream we will scrape. */
export const IMAGE_URL = `${BASE_URL}/${IMAGE_SIZE}.jpg` as const;

/**
 * This is the root directory for all assets. It is recommended to keep this
 * set to `assets`, since other parts of the project might expect this to be
 * the convention in place.
 */
export const BASEDIR = "./assets";

/**
 * The directory to categorize images in. To store them in the root assets
 * directory, leave this blank. Accepts some special values as replacement
 * patterns for the following values:
 *
 * | Pattern  | Value |
 * |:---------:|:-------------:|
 * | `%Y` or `{Y}` | current year |
 * | `%m` or `{m}` | current month |
 * | `%d` or `{d}` | current day |
 * | `%H` or `{H}` | current hour |
 * | `%M` or `{M}` | current minute |
 * | `%S` or `{S}` | current second |
 * | `%Z` or `{Z}` | timezone offset |
 */
export const PATHNAME = "{YYYY}-{MM}-{DD}";

/**
 * The filename to store the image in. Accepts the same replacement patterns as
 * the {@link PATH} constant, for date and time injection.
 *
 * **Note**: we omit the path here for compatibility with the semantics of the
 * linking process and the scraping process; we delegate the path resolution
 * step to each of the aforementioned parts of the program rather than making
 * assumptions about it here.
 */
export const FILENAME = "{HH}_{mm}_{ss}.jpg";

/**
 * The hardlink destination for the latest image. To avoid having to traverse
 * the filesystem and locate the newest photo (or otherwise maintain internal
 * state as to which image is the latest), we simply update the hardlink each
 * time we scrape a new image.
 *
 * **Note**: we omit the path here for compatibility with the semantics of the
 * linking process and the scraping process. We delegate the path resolution
 * step to each of the aforementioned parts of the program rather than making
 * assumptions about it here.
 */
export const LATEST = "latest.jpg";

/**
 * Delay time in milliseconds to re-attempt a scrape. This only applies if the
 * image returned by the scrape is the same as the previous one, which means
 * the scrape was likely triggered before the image was updated. In this case,
 * it will retry up to 3 times, waiting this amount between attempts, before
 * giving up altogether.
 */
export const DELAY = 60_000;

// #endregion F1 Scraper
