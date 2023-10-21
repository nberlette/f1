## Scraping build photos of the Formula 1 track in Las Vegas

This is an autonomous image scraper developed using [TypeScript], [Deno], and
[GitHub Actions]. It was purpose-built to document the historic
[Formula 1][formula1] track construction in
[Las Vegas, Nevada][formula1-official-site], slated to host the inaugural
Heineken Silver Grand Prix on November 18th. The images will be stitched
together to form timelapse videos of the track's lifecycle.

---

[📸 **Latest**][latest-snapshot] • [🎬 **Timelapse**][timelapse-preview] • [🗓️ **Previous Images**][previous-snapshots] • ℹ️ [**Project Details**][about] • [🌟 **Star It!**][Star on GitHub]

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./img/f1_artwork_5.jpg">
  <img alt="AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip" src="./img/f1_artwork_3.png">
</picture>

---

Since June 3rd, 2023 this project has collected nearly **20,000 images**, all
courtesy of a live-streaming [construction camera][oxblue] provided by the
track's developers. This project is not affiliated with [Formula 1][formula1].

#### Track Details and Statistics

| Estimated Top Speed | Circuit Length      | Corners | Straights | DRS Zones |
| ------------------- | ------------------- | ------- | --------- | --------- |
| 212 mph • 342 km/h  | 3.8 miles • 6.12 km | 17      | 3         | 2         |

---

## Latest Snapshot

<a href="https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true" title="The latest image scraped from the Formula 1 track build in Las Vegas"><img src="https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true&no-cache=true&cache=no-cache" alt="The latest image scraped from the Formula 1 track build in Las Vegas" style="border-radius:8px" /></a>

---

## Timelapse Preview

<video src="https://github-production-user-asset-6210df.s3.amazonaws.com/11234104/276683933-1028d045-3561-408c-9bf0-512249804472.mp4" data-canonical-src="https://user-images.githubusercontent.com/11234104/276683933-1028d045-3561-408c-9bf0-512249804472.mp4" controls="controls" muted="muted" style="max-height:640px; min-height: 200px; display: block; width: 100%; border-radius: 8px"></video>

> **Note**: this video was created with images from **2023-08-15** - **2023-10-12**

---

## About

The first scrape happened on June 3rd, 2023. As of October 18th it has surpassed
**18,500 commits**, equivalent to over **1.2GB** of image data. Photos are stored
in the `./assets` folder of this repository, and also persisted to a **[Deno KV]** 
database backed by [FoundationDB].

The origin of the scraped images is an real-time photo feed, sourced directly
from the official Formula 1 website.

> ⚠️ This project is for educational purposes and is not affiliated with Formula 1.

#### [📖 **Click here for an in-depth explanation of the scrape process**](#scrape-process-step-by-step)

### Tools Used

- [x] [`Deno v1.37.2`][Deno v1.37.2]
  - <small>Rust-based JS runtime, sandboxed, with great TS/TSX support.</small>
  - <small>Provides the tools for network and file system operations.</small>
- [x] [`TypeScript 5.2.2`][TypeScript]
  - <small>Superset of JavaScript featuring advanced static typechecking.</small>
  - <small>Better type safety means more readable and maintainable code.</small>
- [x] [`GitHub Actions`][GitHub Actions]
  - <small>Provides **free** macOS virtual machines powering the scraper.</small>
  - <small>Responsible for scheduled execution of the scraper [workflow]</small>
  - <small>Temporarily stores the image [artifacts](#workflow-artifacts)</small>
- [x] [`Deno KV`][Deno KV Docs] <small> _(currently in beta)_</small>
  - <small>Provides us with global data persistence and caching</small>
- [x] [`ffmpeg`][ffmpeg] <small> _(timelapse feature is **unstable**)_</small>
  - <small>Leveraged to automatically generate timelapse videos</small>

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./img/f1_artwork_1.png">
  <img alt="AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip" src="./img/f1_artwork_2.png">
</picture>

> AI-generated F1 art created with [SDXL 1.0][sdxl] and the prompt
> `"Formula 1 cars on the Las Vegas Strip"`

---

## How it Works

The majority of the work happens in [`main.ts`][main.ts], despite it only being
3 lines of code. It is responsible for invoking the scraper located in
[`src/scrape.ts`][src-scrape.ts], and is ran every 10 minutes by a GitHub Action
defined by the workflow in [`main.yml`][workflow].

### Assets and Data

Images are named after their capture time as a `JPEG` file in **UTC**. For
example, an image captured at `2023-07-09T04:28:57` would be saved as
[`./assets/2023-07-09/04_28_57.jpg`](https://github.com/nberlette/f1/blob/main/assets/2023-07-09/04_28_57.jpg?raw=true).
The latest image is always saved as [`./assets/latest.jpg`][latest-img] for easy access.

### Scrape Process, Step-by-Step

1. GitHub Actions runs the [scrape workflow][workflow] every ~10 minutes, depending on traffic.
2. The runner checks out the repo, installs [Deno][deno], and prepares to scrape.
3. `deno task scrape` is executed, which runs the [`main.ts`][main.ts] file.
4. [`main.ts`][main.ts] imports [`scrape()`][function-scrape] from [`src/scrape.ts`][src-scrape.ts],
   which contains the [**`read`**][function-read] and [**`write`**][function-write] functions.
5. 🔍 **READ**: [`read()`][function-read] is called with [`IMAGE_URL`][const-image-url].
   - Internally, the [Fetch API] is used to download the image.  
     If the request fails, it will be retried up to [`ATTEMPTS`][const-attempts]
     times, with a short pause between each successive attempt.
   - If all attempts are exhausted without success, the run will **terminate**.
   - Otherwise, a new instance of the [`Image`][src-image.ts] class is returned.
6. 💾 **WRITE**: [`write()`][function-write] is called with the new [`Image`][src-image.ts].
     Before writing the image, it runs through some checks:
   1. The [`Image.hash`][image-hash] is checked against the hash "table" in [Deno KV].  
      - If an entry exists, the image is stale and won't make it any further. 
      - If Deno KV is unavailable, the image data is checked against [`latest.jpg`][latest-img] via
       a timing-safe equality comparison, avoiding exposure to timing-based attacks.
      - **The job starts over at _step 5_** and repeats until a new image is found, or the maximum
        [`ATTEMPTS`][const-attempts] are all used. **If nothing is found by now, the job fails**.  
   2. If the scraper has made it this far, then we have a fresh image and need to store it.
      - [`Image.write()`][image-write] persists the image to [Deno KV].
         > The key is generated by the `Image` API, using the image timestamp.  
      - The image timestamp is indexed with its unique SHA-256 hash in [Deno KV].  
         > This prevents later scrapes from duplicating this image. It also means  
         > if you try to instantiate a new Image from an old hash, it will always  
         > return the original image and its original timestamp.
      - [`Image.writeFile()`][image-writefile] saves it to the local file system.
         > The filename is generated by the `Image` API, using the image timestamp.
      - `Image.writeFile()` also saves it to [`./assets/latest.jpg`][latest-img],
   3. The [`setOutput`][src-helpers-actions.ts] helper pipes the image metadata
       to the GitHub Actions runner, to be used in the commit step.
   4. The scrape is now complete and the runner proceeds to the final steps.
6. The photo is stored as a workflow artifact for **90 days**.
7. All changes are committed + pushed to the repository.
8. 🏁 The job finishes successfully and the runner is terminated. Hooray!

---

## Previous Snapshots

<table>
<thead>
  <th>October 17th</th>
  <th>October 15th</th>
  <th>October 13th</th>
  <th>October 11th</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-17/20_26_59.jpg?raw=true" title="2023-10-17T20:26:59" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-17/20_26_59.jpg?raw=true" alt="2023-10-17T20:26:59" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-15/21_38_24.jpg?raw=true" title="2023-10-15T21:38:24" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-15/21_38_24.jpg?raw=true" alt="2023-10-15T21:38:24" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-13/23_52_14.jpg?raw=true" title="2023-10-13T23:52:14" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-13/23_52_14.jpg?raw=true" alt="2023-10-13T23:52:14" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-11/21_26_47.jpg?raw=true" title="2023-10-11T21:26:47" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-11/21_26_47.jpg?raw=true" alt="2023-10-11T21:26:47" style="border-radius:8px" /></a></td>
</tr>
</tbody>
<thead>
  <th>October 9th</th>
  <th>October 7th</th>
  <th>October 5th</th>
  <th>October 3rd</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-09/22_27_19.jpg?raw=true" title="2023-10-09T22:27:19" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-09/22_27_19.jpg?raw=true" alt="2023-10-09T22:27:19" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-07/22_26_51.jpg?raw=true" title="2023-10-07T22:26:51" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-07/22_26_51.jpg?raw=true" alt="2023-10-07T22:26:51" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-05/22_19_31.jpg?raw=true" title="2023-10-05T22:19:31" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-05/22_19_31.jpg?raw=true" alt="2023-10-05T22:19:31" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-03/22_20_37.jpg?raw=true" title="2023-10-03T22:20:37" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-03/22_20_37.jpg?raw=true" alt="2023-10-03T22:20:37" style="border-radius:8px" /></a></td>
</tr>
</tbody>
<thead>
  <th>October 2nd</th>
  <th>September 28th</th>
  <th>September 24th</th>
  <th>September 20th</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-02/22_29_06.jpg?raw=true" title="2023-10-02T22:29:06" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-02/22_29_06.jpg?raw=true" alt="2023-10-02T22:29:06" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-28/22_24_03.jpg?raw=true" title="2023-09-28T22:24:03" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-28/22_24_03.jpg?raw=true" alt="2023-09-28T22:24:03" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-24/22_12_21.jpg?raw=true" title="2023-09-24T22:12:21" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-24/22_12_21.jpg?raw=true" alt="2023-09-24T22:12:21" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-20/22_22_10.jpg?raw=true" title="2023-09-20T22:22:10" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-20/22_22_10.jpg?raw=true" alt="2023-09-20T22:22:10" style="border-radius:8px" /></a></td>
</tr>
</tbody>
<thead>
  <th>September 16th</th>
  <th>September 12th</th>
  <th>September 8th</th>
  <th>September 4th</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_20_41.jpg?raw=true" title="2023-09-04T22:20:41" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_20_41.jpg?raw=true" alt="2023-09-04T22:20:41" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_45_35.jpg?raw=true" title="2023-09-16T22:45:35" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_45_35.jpg?raw=true" alt="2023-09-16T22:45:35" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-10/22_33_07.jpg?raw=true" title="2023-09-10T22:33:07" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-10/22_33_07.jpg?raw=true" alt="2023-09-10T22:33:07" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-04/22_49_09.jpg?raw=true" title="2023-09-04T22:49:09" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-04/22_49_09.jpg?raw=true" alt="2023-09-04T22:49:09" style="border-radius:8px" /></a></td>
</tr>
</tbody>
</table><br>

---

<br><h4><a href="https://nick.mit-license.org" rel="noopener nofollow" target="_blank" title="MIT © Nicholas Berlette"><strong>MIT</strong></a> © <a href="https://github.com/nberlette" rel="noopener nofollow" target="_blank" title="Nicholas Berlette's Profile on GitHub"><strong>Nicholas Berlette</strong></a> · <small><em>Made with ♥️ in Las Vegas, NV</em></small></h4><br>

<br>

<h6>⚠️ This project is not affiliated with Formula 1 nor the FIA. For educational purposes only.</h6>

---

<!-- Project Links -->

[latest-snapshot]: #latest-snapshot "View the latest snapshot from the construction site"
[timelapse-preview]: #timelapse-preview "View a short sample timelapse video, created from the last 8 weeks of photos."
[previous-snapshots]: #previous-snapshots "View some of the previously captured snapshots"
[about]: #about "Interested in how it works? Click here for more info!"
[MIT]: https://nick.mit-license.org "MIT License"
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette's GitHub profile"
[nberlette]: https://github.com/nberlette "Nicholas Berlette's GitHub profile"
[n.berlette.com/f1]: https://n.berlette.com/f1 "View the GitHub Pages site at n.berlette.com/f1"
[Star on GitHub]: https://github.com/nberlette/f1/stargazers "Star this project on GitHub!"
[readme]: https://github.com/nberlette/f1#readme "View the README on GitHub"
[workflow]: https://github.com/nberlette/f1/blob/main/.github/workflows/main.yml "GitHub Actions workflow file"
[assets]: https://github.com/nberlette/f1/tree/main/assets "View the 'assets' folder on GitHub"
[main.ts]: https://github.com/nberlette/f1/blob/main/main.ts "View the source code for the 'main.ts' file on GitHub"
[src-scrape.ts]: https://github.com/nberlette/f1/blob/main/src/scrape.ts "View the source code for the 'src/scrape.ts' file on GitHub"
[src-helpers.ts]: https://github.com/nberlette/f1/blob/main/src/helpers.ts "View the source code for the 'src/helpers.ts' file on GitHub"
[src-constants.ts]: https://github.com/nberlette/f1/blob/main/src/constants.ts "View the source code for the 'src/constants.ts' file on GitHub"
[src-image.ts]: https://github.com/nberlette/f1/blob/main/src/image.ts "View the source code for the 'src/image.ts' file on GitHub"
[image-hash]: https://github.com/nberlette/f1/blob/main/src/image.ts "View the source code for the 'src/image.ts' file on GitHub"
[src-helpers-actions.ts]: https://github.com/nberlette/f1/blob/main/src/helpers/actions.ts "View the source code for the 'src/helpers/actions.ts' file on GitHub"
[const-attempts]: https://github.com/nberlette/f1/blob/main/src/constants.ts#L37 "View the source for the 'ATTEMPTS' constant on GitHub"
[const-delay]: https://github.com/nberlette/f1/blob/main/src/constants.ts#L30 "View the source for the 'DELAY' constant on GitHub"
[const-image-url]: https://github.com/nberlette/f1/blob/main/src/constants.ts#L47 "View the source for the 'IMAGE_URL' constant on GitHub"
[image-write]: https://github.com/nberlette/f1/blob/main/src/image.ts#L205 "View the source for the 'Image.write()' method on GitHub"
[image-writefile]: https://github.com/nberlette/f1/blob/main/src/image.ts#L250 "View the source for the 'Image.writeFile()' method on GitHub"
[function-scrape]: https://github.com/nberlette/f1/blob/main/src/scrape.ts#L30 "View the source for the 'scrape()' function on GitHub"
[function-read]: https://github.com/nberlette/f1/blob/main/src/scrape.ts#L51 "View the source for the 'read()' function on GitHub"
[function-write]: https://github.com/nberlette/f1/blob/main/src/scrape.ts#L96 "View the source for the 'write()' function on GitHub"
[latest-img]: https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true&no-cache&cache=no-cache "The latest snapshot of the Formula 1 track construction site in Las Vegas, Nevada."
[artwork-1]: ./img/f1_artwork_1.png "AI-Generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-2]: ./img/f1_artwork_2.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-3]: ./img/f1_artwork_3.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-4]: ./img/f1_artwork_4.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-5]: ./img/f1_artwork_5.jpg "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"

<!-- Third Party Links -->

[Fetch API]: https://mdn.io/Fetch%20API
[GitHub Actions]: https://github.com/features/actions "GitHub Actions Official Landing Page"
[sdxl]: https://github.com/Stability-AI/stablediffusion "Stable Diffusion XL 1.0"
[ffmpeg]: https://ffmpeg.org "The FFmpeg Project Official Website"
[Track Layout]: https://www.f1lasvegasgp.com/track-layout "Formula 1's Las Vegas Grand Prix Track Layout"
[Formula 1]: https://www.formula1.com
[formula1]: https://www.formula1.com/en/latest/article.las-vegas-to-host-formula-1-grand-prix-from-2022.3Z1Z3ZQZw8Zq8QZq8QZq8Q.html "Formula 1's announcement of the Las Vegas Grand Prix"
[formula1-official-site]: https://www.formula1.com/en/racing/2023/Las_Vegas.html "Official Site for the Formula 1 Heineken Silver Las Vegas Grand Prix 2023"
[oxblue]: https://oxblue.com "OxBlue Construction Cameras"
[typescript]: https://typescriptlang.org "TypeScript's Official Website"
[deno]: https://deno.land "Deno's Official Website - A secure runtime for JavaScript and TypeScript"
[Deno KV]: https://deno.land/manual@v1.36.0/runtime/kv "Deno KV - key-value store built directly into the Deno runtime."
[FoundationDB]: https://www.foundationdb.org "FoundationDB's Official Website"
[Deno v1.37.2]: https://deno.land/manual@v1.37.2
[Deno KV Docs]: https://docs.deno.com/kv/manual
