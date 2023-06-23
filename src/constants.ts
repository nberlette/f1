/** DO NOT CHANGE THIS */
const BASE_URL = "https://oxblue.com/archive/a4ed2c099b4f3d942fd3d69702cd6d6b";

/** The size of the image to scrape. */
export const IMAGE_SIZE: `${number}x${number}` = "1024x768";

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

export let DEBUG_MODE: boolean = Boolean(Deno.env.get("DEBUG"));
