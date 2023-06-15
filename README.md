<div align="center">

# 🏎️ F1

This is a simple automated scraper powered by Deno and GitHub Actions.\
It captures a live photo every 15 minutes of the [**Formula 1**][formula1] track
being built in Las Vegas, NV.

The track is slated for completion in October 2023. The race is in November.\
At the end of the project, the images will be stitched together into a timelapse
video.

</div>

<br>

## Latest Image

[![The latest snapshot of the Formula 1 track construction site in Las Vegas, Nevada.][latest-img]][latest-img]

## Summary

The majority of the work happens in [`main.ts`](./main.ts). It is run every 15
minutes by a GitHub Actions workflow in
[`main.yml`](./.github/workflows/main.yml). Images are stored in the
[`./assets`](./assets) folder, with their time of scrape for filenames.

The script is pretty basic, and has 0 dependencies other than Deno. It fetches
the latest image from a live feed, saves it to `./assets`, and makes a copy to
`latest.jpg` for convenience.

### Coming Soon: F1 Frontend

I'm working on a frontend to display the images in a more user-friendly way. It
will either be hosted on GitHub Pages or Deno Deploy, and will be covered here
when it's ready. The idea is a "running" timelapse, which grows on its own as
additional images are scraped. It'll provide a nice way to see the progress in
real time, and also accomplish the goal of creating a timelapse video at the end
of the project. Sweet!

### Tools Used

- [x] [`Deno v1.34`](https://deno.land/manual@v1.34.1)
- [x] [`GitHub Actions`](https://github.com/actions)
- [x] [`TypeScript 5.0.4`](https://typescriptlang.org)

### Image Source

The data source on the scraped images is an updating live photo feed sourced
from the official Formula 1 website. As long as it remains up and transmitting
data, this project will continue to auto-update.

> This project will continue to update until the track is completed, but could
> be discontinued at any time if the image stream becomes unavailable.

---

## Bonus Artwork

Just to get in on the AI hypetrain, here's some AI-generated artwork of F1 cars
racing down the Las Vegas Strip. The images were generated using OpenAI's
[DALLE 2][dalle] (the version of GPT fine-tuned to handle images)

> Prompt: `"Formula 1 cars racing on the Las Vegas Strip, digital art"`

![Synthwave-style digital art of a Formula 1 race car racing down the neon Las Vegas Strip][bonus-img-1]

![Synthwave-style digital art of a Formula 1 race car racing down the neon Las Vegas Strip][bonus-img-2]

---

<div align="center"><br>

<!-- deno-fmt-ignore -->
[**MIT**][MIT] © [**Nicholas Berlette**][nberlette]

##### _‹ all rights reserved ›_

<br>

•••

###### This project is not affiliated with Formula 1, the FIA, or any of their subsidiaries. This project is not for profit, and is intended for educational purposes only. Images copyright to the owner of the camera. _I'm just a fan with a code habit._

</div>

[MIT]: https://nick.mit-license.org "MIT License"
[nberlette]: https://github.com/nberlette "Nicholas Berlette's GitHub profile"
[dalle]: https://labs.openai.com/ "OpenAI's DALLE 2"
[formula1]: https://www.formula1.com/en/latest/article.las-vegas-to-host-formula-1-grand-prix-from-2022.3Z1Z3ZQZw8Zq8QZq8QZq8Q.html "Formula 1's announcement of the Las Vegas Grand Prix"
[latest-img]: ./assets/latest.jpg "The latest snapshot of the Formula 1 track construction site in Las Vegas, Nevada."
[bonus-img-1]: .github/opengraph.jpg "Synthwave-style digital art of a Formula 1 race car racing down the neon Las Vegas Strip"
[bonus-img-2]: .github/opengraph-1.jpg "Synthwave-style digital art of a Formula 1 race car racing down the neon Las Vegas Strip"
