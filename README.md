<div align="center">

# 🏎️ F1

This is an automated image scraper powered by Deno and GitHub Actions. It
captures a live photo every 15 minutes of the [**Formula 1**][formula1] track
being built in Las Vegas, NV.

Image data is persisted in binary form using [**Deno KV**][deno-kv], each with a
hard copy `.jpg` file located in the repository for additional redundancy and
ease of access. The images are being compiled into Timelapse videos using
ffmpeg.

The track is slated for completion in October 2023. The race is in November.

</div>

## Latest Image

![The latest snapshot of the Formula 1 track construction site in Las Vegas, Nevada.][latest-img]

### Previous Snapshots

<table>
<thead>
  <th>September 16th</th>
  <th>September 10th</th>
  <th>September 4th</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_45_35.jpg?raw=true" title="2023-09-16T22:45:35" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_45_35.jpg?raw=true" alt="2023-09-16T22:45:35" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-10/22_27_03.jpg?raw=true" title="2023-09-10T22:27:03" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-10/22_27_03.jpg?raw=true" alt="2023-09-10T22:27:03" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-04/22_49_09.jpg?raw=true" title="2023-09-04T22:49:09" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-04/22_49_09.jpg?raw=true" alt="2023-09-04T22:49:09" style="border-radius:8px" /></a></td>
</tr>
</tbody>
<thead>
  <th>August 28th</th>
  <th>August 21st</th>
  <th>August 14th</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-08-28/22_45_21.jpg?raw=true" title="2023-08-28T22:45:21" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-08-28/22_45_21.jpg?raw=true" alt="2023-08-28T22:45:21" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-08-21/22_45_10.jpg?raw=true" title="2023-08-21T22:45:10" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-08-21/22_45_10.jpg?raw=true" alt="2023-08-21T22:45:10" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-08-14/22_42_06.jpg?raw=true" title="2023-08-14T22:42:06" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-08-14/22_42_06.jpg?raw=true" alt="2023-08-14T22:42:06" style="border-radius:8px" /></a></td>
</tr>
</tbody>
</table>

---

## How does it work?

The majority of the work happens in [`main.ts`](./main.ts), despite it only
being 3 lines of code. It is responsible for invoking the scraper located in
[`src/scrape.ts`][src-scrape.ts], and is ran every 10 minutes by a GitHub Action
defined by the workflow in [`main.yml`](./.github/workflows/main.yml).

### Tools Used

- [x] [`Deno v1.36.4`](https://deno.land/manual@v1.34.1) <small> _(for
      execution)_</small>
- [x] [`Deno KV`](https://docs.deno.com/kv/manual) <small> _(for data
      persistence)_</small>
- [x] [`GitHub Actions`](https://github.com/actions) <small> _(for
      automation)_</small>
- [x] [`TypeScript 5.1.6`](https://typescriptlang.org) <small> _(for type
      safety)_</small>
- [x] [`ffmpeg`](https://ffmpeg.org) <small> _(for timelapse creation)_</small>

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
3. [`main.ts`][main.ts] checks if it is being run as intended (and not imported
   by another module), and if so dynamically imports `scrape` from
   [`src/scrape.ts`][src-scrape.ts] and immediately calls it.
4. [`src/scrape.ts`][src-scrape.ts] defines the asynchronous `scrape()`
   function, which internally defines functions named `read` and `write`. The
   following steps are taken:
   1. The latest image to be scraped is loaded into a new
      [`Image`][src-image.ts] instance.
   2. If necessary, the folder for the current day is created in
      [`./assets`][assets].
   3. `read()` is called with `IMAGE_URL` from
      [`src/constants.ts`][src-constants.ts].
      1. If the request fails, it will be retried up to the number of times
         defined by the `ATTEMPTS` constant, with an increasing delay between
         each successive attempt.
      2. If it fails after the last attempt, the job will fail and the runner
         will be terminated.
      3. If it succeeds, the image is returned as an instance of the
         [`Image`][src-image.ts] class, defined in
         [`src/image.ts`][src-image.ts].
   4. `write()` is called with the image as its only argument.
      1. The image is compared for equality against the latest image (scrape
         step 1). If they are equal, it means the image has not yet updated.
         - For a maximum of `ATTEMPTS` times, the image is re-scraped and
           compared against the latest image.
         - If they are still equal, the job will fail and the runner will be
           terminated.
      2. Now that we have a fresh image, it is first written to the
         [`Deno KV`][deno-kv] database using the [`Image.write()`][src-image.ts]
         method and logged to the console.
      3. The image is then written to the filesystem using the
         [`Image.writeFile()`][src-image.ts] method, and also logged to the
         console.
      4. The image is finally written to the [`./assets/latest.jpg`][latest-img]
         file, and the updated image size difference is logged to the console.
      5. The [`setOutput`][src-helpers-actions.ts] method is called with the
         filename of the new image, so the GitHub Actions runner can use it as
         an output variable.
         - In additional, several other outputs are set with metadata about the
           image.
   5. The scrape is now complete and the runner proceeds to the next step.
5. The photo is uploaded as a GitHub Workflow artifact for 90 days of remote
   access.
6. The runner commits the changes to the repository, and pushes them to the
   repository.
7. The job completes and the runner is terminated.

### See it for yourself!

**If you'd like to see the code for yourself, check out the
[`src/scrape.ts`][src-scrape.ts] file.**

For a real-world example of Deno KV in action, [`src/image.ts`][src-image.ts]
employs both the local file-system I/O **_and_** Deno KV to process, store,
deduplicate the images. The file [`src/kv/blobs.ts`][src-kv-blobs.ts] contains
the logic for handling large binary data buffers in Deno KV (which has a 63KB
cap on all values) -- it was directly adapted from
[Kitson Kelly's `kv_toolbox` project](https://github.com/kitsonk/kv_toolbox/blob/main/blob.ts).

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/img/f1_artwork_4.png">
  <img alt="AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip" src="./docs/img/f1_artwork_3.png">
</picture>

> AI-generated F1 art created with [SDXL 1.0][sdxl] and the prompt
> `"Formula 1 cars on the Las Vegas Strip"`

---

## Further Reading

### What happens to the images?

Images are named after their capture time as a `JPEG` file in **UTC**. For
example, an image captured at `2023-07-09T04:28:57` would be saved as
[`./assets/2023-07-09/04_28_57.jpg`](./assets/2023-07-09/04_28_57.jpg).

The latest image is always written to [`./assets/latest.jpg`][latest-img] for
easy access, and is updated every time the scraper runs successfuly.

#### Assets and Data

All images are saved in the [`./assets`][assets] folder with each day's photos
in a separate subfolder. The latest image is always saved as
[`./assets/latest.jpg`][latest-img] for easy access.

#### Cloud Persistence

Each image is also persisted in a Deno KV database, backed by FoundationDB on
the edge thanks to Deno Deploy. For added redundancy and convenience.

#### Workflow Artifacts

All scraped assets are also saved as GitHub Workflow artifacts for 90 days,
allowing remote access without having to clone all the images.

---

### Camera Location

The camera is at the "Harmon Paddock" zone of the track, located just southeast
of _"The Strip"_ (Las Vegas Blvd) near Harmon Avenue and Koval Lane. The camera
itself is mounted directly on the roof of the Paddock building, facing
south-southeast. It gives a great view of the grandstands (bleachers) and what
appears to be shaping up to be the start/finish line of the track.

### Camera Angle Change on August 15th, 2023

Something which is completely out of my control is anything related to the
actual camera itself. That being said, when the construction crew suddenly chose
to relocate it on August 15th, it effectively split the timelapse part of this
project into two parts.

#### Where is the camera now?

The camera **_was_** facing north-northwest, giving a bird-eye view of the
Paddock area and the track's first corner, with the iconic Las Vegas Strip in
the background. As of August 15th, however, the camera is now facing
south-southeast towards the Harry Reid International Airport, with the MGM Grand
in the background to the right.

It's not all bad though - in my opinion, the new angle is far superior to the
previous one, and it provides quite a bit more content for us since it's in an
area with much more activity.

#### What are we doing about it?

The first angle will be made into a separate timelapse video, from June 3rd,
2023 through August 15th, 2023. The second angle will be from August 15th, 2023
through the completion of the track.

---

### Future Plans

A frontend display for viewing the images as a growing timelapse is under
development. Check [`n.berlette.com/f1`](https://n.berlette.com/f1) for updates.

---

<div align="center"><br>

[**MIT**][MIT] © [**Nicholas Berlette**][nberlette]

###### This project is not affiliated with [Formula 1][formula1] or the FIA.<br><small>It is for educational and historical documentation purposes only.</small>

</div>

[MIT]: https://nick.mit-license.org "MIT License"
[nberlette]: https://github.com/nberlette "Nicholas Berlette's GitHub profile"
[sdxl]: https://github.com/Stability-AI/stablediffusion "Stable Diffusion XL 1.0"
[formula1-site]: https://www.f1lasvegasgp.com/track-layout "Formula 1's Las Vegas Grand Prix Track Layout"
[formula1]: https://www.formula1.com/en/latest/article.las-vegas-to-host-formula-1-grand-prix-from-2022.3Z1Z3ZQZw8Zq8QZq8QZq8Q.html "Formula 1's announcement of the Las Vegas Grand Prix"
[oxblue]: https://oxblue.com "OxBlue Construction Cameras"
[typescript]: https://typescriptlang.org "TypeScript's Official Website"
[deno]: https://deno.land "Deno's Official Website - A secure runtime for JavaScript and TypeScript"
[deno-kv]: https://docs.deno.com/kv "Deno KV - key-value store built directly into the Deno runtime."
[workflow]: https://github.com/nberlette/f1/blob/main/.github/workflows/main.yml "GitHub Actions workflow file"
[assets]: https://github.com/nberlette/f1/tree/main/assets "View the 'assets' folder on GitHub"
[main.ts]: https://github.com/nberlette/f1/blob/main/main.ts "View the source code for the 'main.ts' file on GitHub"
[src-scrape.ts]: https://github.com/nberlette/f1/blob/main/src/scrape.ts "View the source code for the 'src/scrape.ts' file on GitHub"
[src-helpers.ts]: https://github.com/nberlette/f1/blob/main/src/helpers.ts "View the source code for the 'src/helpers.ts' file on GitHub"
[src-constants.ts]: https://github.com/nberlette/f1/blob/main/src/constants.ts "View the source code for the 'src/constants.ts' file on GitHub"
[src-image.ts]: https://github.com/nberlette/f1/blob/main/src/image.ts "View the source code for the 'src/image.ts' file on GitHub"
[src-helpers-actions.ts]: https://github.com/nberlette/f1/blob/main/src/helpers/actions.ts "View the source code for the 'src/helpers/actions.ts' file on GitHub"
[src-helpers-sleep.ts]: https://github.com/nberlette/f1/blob/main/src/helpers/sleep.ts "View the source code for the 'src/helpers/sleep.ts' file on GitHub"
[src-helpers-equals.ts]: https://github.com/nberlette/f1/blob/main/src/helpers/equals.ts "View the source code for the 'src/helpers/equals.ts' file on GitHub"
[src-kv-blobs.ts]: https://github.com/nberlette/f1/blob/main/src/kv/blobs.ts "View the source code for the 'src/kv/blobs.ts' file on GitHub"
[latest-img]: https://github.com/nberlette/f1/raw/main/assets/latest.jpg?no-cache=2 "The latest snapshot of the Formula 1 track construction site in Las Vegas, Nevada."
[artwork-1]: ./docs/img/f1_artwork_1.png "AI-Generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-2]: ./docs/img/f1_artwork_2.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-3]: ./docs/img/f1_artwork_3.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-4]: ./docs/img/f1_artwork_4.png
