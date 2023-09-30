![Formula 1 AI-generated fan art][artwork-4]

---

## Capturing photos of the Las Vegas Formula 1 track build

This project is a purpose-built image scraper developed in TypeScript and powered by Deno. Its sole purpose is to capture a live snapshot every every ~10 minutes of the new Formula 1 race track that is currently under construction in Las Vegas, NV.

It is automated by GitHub Actions to run at regular intervals, and leverages Deno KV for data persistance. For accessibility and additional redudancy (since Deno KV is still in beta), a hard copy of each scraped image is also pushed to the repository. Once the track is completed (or whenever the live stream goes offline), **all** of the photos it has collected will be then be compiled into a timelapse video using ffmpeg. That will conclude this project and it will then be archived.

The actual race (officially known as the **_"Formula 1 Heineken Silver Las Vegas Grand Prix 2023"_**) will be held on **November 18th, 2023**, with practice and qualifying the two days prior. For more information on the race itself, [**see the official site here**][formula1-official-site].

ℹ️ [**Interested in how it works? Click here for more info!**](#about)

🌟 [**Think this project is cool? Please star it on GitHub!**][github-star]

📸 [**View the latest snapshot of the construction site**](#latest-snapshot)

🗓️ [**View some of the previously captured snapshots**](#previous-snapshots)

## Latest Snapshot

<a href="https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true" title="The latest image scraped from the Formula 1 track build in Las Vegas"><img src="https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true" alt="The latest image scraped from the Formula 1 track build in Las Vegas" style="border-radius:8px" /></a>

### Previous Snapshots

<table>
<thead>
  <th>September 24th</th>
  <th>September 20th</th>
  <th>September 16th</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-24/22_12_21.jpg?raw=true" title="2023-09-24T22:12:21" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-24/22_12_21.jpg?raw=true" alt="2023-09-24T22:12:21" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-20/22_22_10.jpg?raw=true" title="2023-09-20T22:22:10" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-20/22_22_10.jpg?raw=true" alt="2023-09-20T22:22:10" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_20_41.jpg?raw=true" title="2023-09-04T22:20:41" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_20_41.jpg?raw=true" alt="2023-09-04T22:20:41" style="border-radius:8px" /></a></td>
</tr>
</tbody>
<thead>
  <th>September 12th</th>
  <th>September 8th</th>
  <th>September 4th</th>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_45_35.jpg?raw=true" title="2023-09-16T22:45:35" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-16/22_45_35.jpg?raw=true" alt="2023-09-16T22:45:35" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-10/22_33_07.jpg?raw=true" title="2023-09-10T22:33:07" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-10/22_33_07.jpg?raw=true" alt="2023-09-10T22:33:07" style="border-radius:8px" /></a></td>
<td><a href="https://github.com/nberlette/f1/blob/main/assets/2023-09-04/22_49_09.jpg?raw=true" title="2023-09-04T22:49:09" rel="noreferrer noopener" target="_blank"><img src="https://github.com/nberlette/f1/blob/main/assets/2023-09-04/22_49_09.jpg?raw=true" alt="2023-09-04T22:49:09" style="border-radius:8px" /></a></td>
</tr>
</tbody>
</table>

## How it Works

The majority of the work happens in [`main.ts`][main.ts], despite it only
being 3 lines of code. It is responsible for invoking the scraper located in
[`src/scrape.ts`][src-scrape.ts], and is ran every 10 minutes by a GitHub Action
defined by the workflow in [`main.yml`][workflow].

[📖 **Click here for an in-depth explanation of the scrape process**](#scrape-process-step-by-step)

### Assets and Data

Images are named after their capture time as a `JPEG` file in **UTC**. For
example, an image captured at `2023-07-09T04:28:57` would be saved as
[`./assets/2023-07-09/04_28_57.jpg`](https://github.com/nberlette/f1/blob/main/assets/2023-07-09/04_28_57.jpg?raw=true). The latest image is always saved as [`./assets/latest.jpg`][latest-img] for easy
access.

#### Cloud Persistence

Each image is also persisted in a Deno KV database, backed by FoundationDB on
the edge thanks to Deno Deploy. For added redundancy and convenience.

#### Workflow Artifacts

All scraped assets are also saved as GitHub Workflow artifacts for 90 days,
allowing remote access without having to clone all the images.

### Tools Used

- [x] [`Deno v1.37.1`](https://deno.land/manual@v1.34.1)
- <small>Fast Rust-based runtime; best-in-class security and TypeScript support</small>
- <small>Provides a built-in HTTP client, file system tools, and a key-value store</small>
- [x] [`TypeScript 5.2.2`](https://typescriptlang.org)
- <small>Superset of JavaScript with advanced static type checking capabilities</small>
- <small>Provides type safety, for easier maintainability and better code overall.</small>
- [x] [`GitHub Actions`](https://github.com/actions)
- <small>Provides **free** macOS virtual machines (runners), on which the scraper runs</small>
- <small>Responsible for the scheduled execution of the scraper workflow</small>
- <small>Also provides a temporary storage space for image artifacts</small>
- [x] [`Deno KV`](https://docs.deno.com/kv/manual) <small>_(currently in beta)_</small>
- <small>Provides global data persistence, state management, and caching</small>
- [x] [`ffmpeg`](https://ffmpeg.org) <small>_(feature under development, coming soon)_</small>
- <small>Leveraged by GitHub Actions to compile timelapse videos from images</small>

### Image Source

The data source on the scraped images is an updating live photo feed sourced
from the official Formula 1 website. As long as it remains up and transmitting
data, this project will continue to auto-update.

> This project will continue to update until the track is completed, but could
> be discontinued at any time if the image stream becomes unavailable.

---

![Formula 1 AI-generated fan art][artwork-2]

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
      2. Now that we have a fresh image, it is first written to the `Deno KV`
         database using the [`Image.write()`][src-image.ts] method and logged to
         the console.
      3. The image is then written to the filesystem using the
         [`Image.writeFile()`][src-image.ts] method, and also logged to the
         console.
      4. The image is finally written to the [`./assets/latest.jpg`] file, and
         the updated image size difference is logged to the console.
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

---

![Formula 1 AI-generated fan art][artwork-3]

> AI-generated F1 art created with [SDXL 1.0][sdxl] and the prompt
> `"Formula 1 cars on the Las Vegas Strip"`

---

## About

The first scrape happened on June 3rd, 2023. As of September 16th, it has
amassed **over 13,000 photos** and counting, totalling just over **1.0GB**!

### Where are the photos?

The photos are stored in the public [**GitHub Repository**][readme], thanks to
GitHub's wonderful free storage for open source projects. They're also persisted
to a [FoundationDB]-backed [**Deno KV** database][deno-kv].

### Who made this?

This project is actively maintained by [**Nicholas Berlette**][nberlette], and
was developed as an [open source project][readme] entirely in his personal time.
The technology used includes [**TypeScript**][typescript], [**Deno**][deno],
[**Deno KV**][deno-kv], and [GitHub Actions][github-actions].

> ⚠️ This is a personal project, with no commercial interests or any form of
monetization, and was built purely out for educational and historical purposes.

### [**Star it on GitHub! ⭐**][github-star]

If you find this project intriguing, consider interacting with it on GitHub. By
starring the repository, you can help it gain more visibility. If you have a
suggestion or want to report a bug, feel free to open an issue or contribute to
the project by making a pull request.

Thanks for stopping by!

— Nicholas Berlette

---

![Formula 1 AI-generated fan art][artwork-1]

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
is complete. Check [`n.berlette.com/f1`](https://n.berlette.com/f1) for updates.

---

##### [MIT] © [**Nicholas Berlette**][nberlette]. Open Source Software, made with ♥️ in Las Vegas, NV.

> This project is not affiliated with [Formula 1][formula1]. For educational purposes only.

<br>

[MIT]: https://nick.mit-license.org "MIT License"
[nberlette]: https://github.com/nberlette "Nicholas Berlette's GitHub profile"
[github-star]: https://github.com/nberlette/f1/stargazers "Star this project on GitHub!"
[github-actions]: https://github.com/features/actions "GitHub Actions Official Landing Page"
[readme]: https://github.com/nberlette/f1#readme "View the README on GitHub"
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
[latest-img]: https://github.com/nberlette/f1/blob/main/assets/latest.jpg?raw=true&no-cache&cache=no-cache "The latest snapshot of the Formula 1 track construction site in Las Vegas, Nevada."
[artwork-1]: ./img/f1_artwork_1.png "AI-Generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-2]: ./img/f1_artwork_2.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-3]: ./img/f1_artwork_3.png "AI-generated artwork of a Formula 1 car racing down the Las Vegas Strip"
[artwork-4]: ./img/f1_artwork_4.png
[sdxl]: https://github.com/Stability-AI/stablediffusion "Stable Diffusion XL 1.0"
[formula1-site]: https://www.f1lasvegasgp.com/track-layout "Formula 1's Las Vegas Grand Prix Track Layout"
[formula1]: https://www.formula1.com/en/latest/article.las-vegas-to-host-formula-1-grand-prix-from-2022.3Z1Z3ZQZw8Zq8QZq8QZq8Q.html "Formula 1's announcement of the Las Vegas Grand Prix"
[formula1-official-site]: https://www.formula1.com/en/racing/2023/Las_Vegas.html "Official Site for the Formula 1 Heineken Silver Las Vegas Grand Prix 2023"
[oxblue]: https://oxblue.com "OxBlue Construction Cameras"
[typescript]: https://typescriptlang.org "TypeScript's Official Website"
[deno]: https://deno.land "Deno's Official Website - A secure runtime for JavaScript and TypeScript"
[deno-kv]: https://deno.land/manual@v1.36.0/runtime/kv "Deno KV - key-value store built directly into the Deno runtime."
[FoundationDB]: https://www.foundationdb.org "FoundationDB's Official Website"
