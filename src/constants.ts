// #region Deno KV

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

// #region Scrape Config

/**
 * Delay time in milliseconds to re-attempt a scrape. This only applies if the
 * image returned by the scrape is the same as the previous one, which means
 * the scrape was likely triggered before the image was updated. In this case,
 * after {@linkcode ATTEMPTS} attempts it will give up and throw an error.
 */
export const DELAY = 30_000;

/**
 * Maximum of 10 attempts x 30_000 ms delay = 5 minutes max delay time.
 *
 * After that, we fail hard.
 */
export const ATTEMPTS = 10;

// #endregion Scrape Config

// #region Source Config

/** The size of the image to scrape. */
export const IMAGE_SIZE = "1024x768";

/** The endpoint URL for the live photo stream we will scrape. */
export const IMAGE_URL =
  "https://oxblue.com/archive/a4ed2c099b4f3d942fd3d69702cd6d6b/1024x768.jpg";

// #endregion Source Config

// #region Text Config

/** The text to display when the image is updated. */
export const TEXT = {
  updated:
    `🆙 UPDATED \u001b[1;4;33m{path}\u001b[0;2m \u001b[0;1;{color}m{arrow} \u001b[4m{diff}\u001b[0m`,
  wrote: `🆕 WROTE {path} \u001b[{color}m↑ {size}\u001b[0m`,
  created: `🆕 CREATED {path} \u001b[{color}m↑ {size}\u001b[0m`,
  error: `🚨 \u001b[1;31mERROR\u001b[0m \u001b[{color}m{message}\u001b[0m`,
  retry:
    `⏱️ {label} · retrying in {time}s... \u001b[2m({attempts} attempts remaining)\u001b[0m`,
} as const;

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
 * | Pattern       | Value           |
 * |:-------------:|:---------------:|
 * | `%Y` or `{Y}` | current year    |
 * | `%m` or `{m}` | current month   |
 * | `%d` or `{d}` | current day     |
 * | `%H` or `{H}` | current hour    |
 * | `%M` or `{M}` | current minute  |
 * | `%S` or `{S}` | current second  |
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

// #endregion
