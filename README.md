# 🏎️ @nberlette/f1 <img align=right src ="https://img.shields.io/github/actions/workflow/status/nberlette/f1/main.yml?label=Scrape%20Images%20&logo=github&style=for-the-badge&color=blue" />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/img/f1_artwork_4.png">
  <img alt="AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip" src="./docs/img/f1_artwork_3.png">
</picture>

---

<div align="center">

## Scraping photos of the Las Vegas Formula 1 track's construction

This is an autonomous image scraper developed using [TypeScript], [Deno], and
[GitHub Actions]. It was purpose-built to document the historic
[Formula 1][formula1] track construction in
[Las Vegas, Nevada][formula1-official-site], slated to host the inaugural
Heineken Silver Grand Prix on November 18th. The images will be stitched
together to form timelapse videos of the track's lifecycle.

Since June 3rd, 2023 this project has collected in excess of 15,000 images,
courtesy of a live-streaming [construction camera][oxblue] provided by the
track's developers. This project is not affiliated with [Formula 1][formula1].

---

[📸 **Latest Snapshot**][latest-snapshot] ·
[🗓️ **Previous Snapshots**][previous-snapshots] ·
[🌟 **Star on GitHub**][Star on GitHub] · ℹ️ [**More Information**][about]

---

| Estimated Top Speed | Circuit Length      | Corners | Straights | DRS Zones |
| ------------------- | ------------------- | ------- | --------- | --------- |
| 212 mph • 342 km/h  | 3.8 miles • 6.12 km | 17      | 3         | 2         |

</div>

---

## Latest Snapshot

<a href="https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true" title="The latest image scraped from the Formula 1 track build in Las Vegas"><img src="https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true" alt="The latest image scraped from the Formula 1 track build in Las Vegas" style="border-radius:8px" /></a>

---

## About

The first scrape happened on June 3rd, 2023. As of October 1st, it has amassed
**over 16,000 photos** from **_two_ build sites**, equivalent to over **1.0GB**
of input material for the timelapse process.

### Where are the photos?

The photos are stored in the public [**GitHub Repository**][readme], thanks to
GitHub's wonderful free storage for open source projects. They're also persisted
to a [FoundationDB]-backed [**Deno KV** database][Deno KV].

### Who made this?

This project is maintained by [**Nicholas Berlette**][nberlette], developed as
an [**open source project**][readme] entirely in his spare time.

Tech stack includes [**TypeScript**][typescript], [**Deno**][deno],
[**Deno KV**][Deno KV], and [**GitHub Actions**][GitHub Actions].

> ⚠️ This non-commercial project is for educational purposes only.

### [**Star it on GitHub! ⭐**][Star on GitHub]

If you find this project intriguing, consider interacting with it on GitHub. By
starring the repository, you can help it gain more visibility. If you have a
suggestion or want to report a bug, feel free to open an issue or contribute to
the project by making a pull request.

Thanks for stopping by!

— Nicholas Berlette

---

## Previous Snapshots

<table>
<thead>
  <th>October 6th</th>
  <th>October 5th</th>
  <th>October 4th</th>
  <th>October 3rd</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-06/22_19_08.jpg?raw=true" title="2023-10-06T22:19:08" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-06/22_19_08.jpg?raw=true" alt="2023-10-06T22:19:08a"style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-05/22_19_31.jpg?raw=true" title="2023-10-05T22:19:31" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-05/22_19_31.jpg?raw=true" alt="2023-10-05T22:19:31" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-10-04/22_19_54.jpg?raw=true" title="2023-10-04T22:19:54" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-10-04/22_19_54.jpg?raw=true" alt="2023-10-04T22:19:54" style="border-radius:8px" /></a></td>
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
</table>

## How it Works

The majority of the work happens in [`main.ts`][main.ts], despite it only being
3 lines of code. It is responsible for invoking the scraper located in
[`src/scrape.ts`][src-scrape.ts], and is ran every 10 minutes by a GitHub Action
defined by the workflow in [`main.yml`][workflow].

[📖 **Click here for an in-depth explanation of the scrape process**](#scrape-process-step-by-step)

### Assets and Data

Images are named after their capture time as a `JPEG` file in **UTC**. For
example, an image captured at `2023-07-09T04:28:57` would be saved as
[`./assets/2023-07-09/04_28_57.jpg`](https://github.com/nberlette/f1/blob/main/assets/2023-07-09/04_28_57.jpg?raw=true).
The latest image is always saved as [`./assets/latest.jpg`][latest-img] for easy
access.

#### Cloud Persistence

Each image is also persisted in a Deno KV database, backed by FoundationDB on
the edge thanks to Deno Deploy. For added redundancy and convenience.

#### Workflow Artifacts

All scraped assets are also saved as GitHub Workflow artifacts for 90 days,
allowing remote access without having to clone all the images.

### Tools Used

- [x] [`Deno v1.37.1`][Deno v1.37.1]
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
- [x] [`ffmpeg`][ffmpeg] <small> _(timelapse feature coming soon)_</small>
- <small>Leveraged by GitHub Actions to compile timelapse videos</small>

### Image Source

The data source on the scraped images is an updating live photo feed sourced
from the official Formula 1 website. As long as it remains up and transmitting
data, this project will continue to auto-update.

> This project will continue to update until the track is completed, but could
> be discontinued at any time if the image stream becomes unavailable.

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/img/f1_artwork_1.png">
  <img alt="AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip" src="./docs/img/f1_artwork_2.png">
</picture>

> AI-generated F1 art created with [SDXL 1.0][sdxl] and the prompt
> `"Formula 1 cars on the Las Vegas Strip"`

---

## Scrape Process, Step-by-Step

1. GitHub Actions runner picks up the job every ~10 minutes, depending on
   traffic.
2. The runner checks out the repository, installs [Deno][deno], and executes the
   command `deno task scrape`, which in turn invokes the [`main.ts`][main.ts]
   file in the project root.
3. [`main.ts`][main.ts] imports `scrape` and double-checks that it is being run
   as the main module (and not imported by another). If so, it immediately calls
   the `scrape()` function, defined in [`src/scrape.ts`][src-scrape.ts] as
   follows:
4. An asynchronous function that contains two inner functions, `read` and
   `write`. The following steps are taken when `scrape` is called:
   1. `read()` is called with `IMAGE_URL` from
      [`src/constants.ts`][src-constants.ts].
      1. Internally, the Fetch API is used to scrape the image from the source
         URL.
      2. If the request fails, it will be retried up to the number of times
         defined by the `ATTEMPTS` constant, with delays between each attempt.
      3. If all attempts are exhausted without success, it **terminates
         immediately**.
      4. If it succeeds, returns a new [`Image`][src-image.ts] instance.
   2. `write()` is called with the Image instance as its only argument.
      1. The image is compared for equality against the latest image, using a
         timing-safe equality check to avoid exposing ourselves to timing-based
         attacks.
         - If they are equal, it means the image has not yet been updated at the
           origin. The scrape will start over from step 4.1, and repeat the
           process until either a new image is found, or the maximum number of
           `ATTEMPTS` is exhausted.
         - If a new image is not discoverd, the job will **immediately
           terminate**.
      2. If we've made it this far, we have a fresh image and we need to store
         it. It is first written to the `Deno KV` database by
         [`Image.write()`][src-image.ts].
      3. The image is written to a file by [`Image.writeFile()`][src-image.ts]
         with our [naming conventions](#assets-and-data), and logged to
         `stdout`.
      4. The image is written to [`./assets/latest.jpg`] as well, and the size
         difference is logged to `stdout` and GitHub Actions Outputs.
      5. The [`setOutput`][src-helpers-actions.ts] method is called with all of
         the metadata for the image, so the runner can process it further.
   3. The scrape is now complete and the runner proceeds to the next step.
5. The photo is stored as a GitHub Workflow artifact for **90 days**.
6. The changes are committed and pushed to the repository.
7. The job completes and the runner is terminated.

---

## Further Reading

### Camera Location

The camera is at the "Harmon Paddock" zone of the track, located just southeast
of _"The Strip"_ (Las Vegas Blvd) near Harmon Avenue and Koval Lane. The camera
itself is mounted directly on the roof of the Paddock building, facing
south-southeast. It gives a great view of the grandstands (bleachers) and what
appears to be shaping up to be the start/finish line of the track.

#### Camera Angle Changes

Something which is completely out of my control is anything related to the
actual camera itself. That being said, when the construction crew suddenly chose
to relocate it on August 15th, it effectively split the timelapse part of this
project into two parts.

##### What changed?

The camera **_was_** facing north-northwest, giving a bird-eye view of the
Paddock area and the track's first corner, with the iconic Las Vegas Strip in
the background. As of August 15th, however, the camera is now facing
south-southeast towards the Harry Reid International Airport, with the MGM Grand
in the background to the right.

It's not all bad though - in my opinion, the new angle is far superior to the
previous one, and it provides quite a bit more content for us since it's in an
area with much more activity.

##### What are we doing about it?

The first angle will be made into a separate timelapse video, from June 3rd,
2023 through August 15th, 2023. The second angle will be from August 15th, 2023
through the completion of the track.

### Future Plans

A frontend display for viewing the images as a growing timelapse is under
development. This will also help create a timelapse video once the track build
is complete. Check [`n.berlette.com/f1`][n.berlette.com/f1] for updates.

---

<footer align="center">

#### [MIT] © [**Nicholas Berlette**][nberlette] • Made with ♥️ in Las Vegas, NV

<small>This project is not affiliated with [Formula 1][formula1] and has no
commercial interests.</small>

</footer>

<!-- Project Links -->

[latest-snapshot]: #latest-snapshot "View the latest snapshot from the construction site"
[previous-snapshots]: #previous-snapshots "View some of the previously captured snapshots"
[about]: #about "Interested in how it works? Click here for more info!"
[MIT]: https://nick.mit-license.org "MIT License"
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
[src-helpers-actions.ts]: https://github.com/nberlette/f1/blob/main/src/helpers/actions.ts "View the source code for the 'src/helpers/actions.ts' file on GitHub"
[latest-img]: https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true&no-cache&cache=no-cache "The latest snapshot of the Formula 1 track construction site in Las Vegas, Nevada."
[artwork-1]: ./docs/img/f1_artwork_1.png "AI-Generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-2]: ./docs/img/f1_artwork_2.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-3]: ./docs/img/f1_artwork_3.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-4]: ./docs/img/f1_artwork_4.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"

<!-- Third Party Links -->

[GitHub Actions]: https://github.com/features/actions "GitHub Actions Official Landing Page"
[sdxl]: https://github.com/Stability-AI/stablediffusion "Stable Diffusion XL 1.0"
[ffmpeg]: https://ffmpeg.org "The FFmpeg Project Official Website"
[Track Layout]: https://www.f1lasvegasgp.com/track-layout "Formula 1's Las Vegas Grand Prix Track Layout"
[formula1]: https://www.formula1.com/en/latest/article.las-vegas-to-host-formula-1-grand-prix-from-2022.3Z1Z3ZQZw8Zq8QZq8QZq8Q.html "Formula 1's announcement of the Las Vegas Grand Prix"
[formula1-official-site]: https://www.formula1.com/en/racing/2023/Las_Vegas.html "Official Site for the Formula 1 Heineken Silver Las Vegas Grand Prix 2023"
[oxblue]: https://oxblue.com "OxBlue Construction Cameras"
[typescript]: https://typescriptlang.org "TypeScript's Official Website"
[deno]: https://deno.land "Deno's Official Website - A secure runtime for JavaScript and TypeScript"
[Deno KV]: https://deno.land/manual@v1.36.0/runtime/kv "Deno KV - key-value store built directly into the Deno runtime."
[FoundationDB]: https://www.foundationdb.org "FoundationDB's Official Website"
[Deno v1.37.1]: https://deno.land/manual@v1.37.1
[Deno KV Docs]: https://docs.deno.com/kv/manual
