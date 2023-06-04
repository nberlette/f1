# 🏎️ F1

Scrapes a live photo every ~30 minutes of the Formula 1 racetrack build
progression in Las Vegas, NV. Scheduled completion is October 2023.

## Summary

The majority of the work happens in [`main.ts`](./main.ts), which is run every
30 minutes by a GitHub Actions workflow in
[`main.yml`](./.github/workflows/main.yml). All images are stored in the
[`./assets`](./assets) folder, with the timestamp of capture as their filename.

The script is pretty basic, and has 0 dependencies other than Deno. It fetches
the latest image from the live photo feed, saves it to the `assets` folder of
this repository, and makes a copy to `latest.jpg` (for convenience sake).

Aside from that it's just some basic logging and error handling, nothing fancy.
At the end of the project, images will probably be stitched together into a
timelapse video.

## Latest Image

![](./assets/latest.jpg)

### Image Source

The data source on the scraped images is an updating live photo feed sourced
from the official Formula 1 website. As long as it remains up and transmitting
data, this project will continue to auto-update.

> This project will continue to update until the track is completed, but could
> be discontinued at any time if the image stream becomes unavailable.

### Tools Used

- [x] [`Deno v1.34`](https://deno.land/manual@v1.34.1)
- [x] [`GitHub Actions`](https://github.com/actions)
- [x] [`TypeScript 5.0.4`](https://typescriptlang.org/)

---

<div align="center">

<br>

[**MIT**](https://nick.mit-license.org) ©
[**Nicholas Berlette**](https://github.com/nberlette)

•••

##### This project is not affiliated with Formula 1, the FIA, or any of their subsidiaries. This project is not for profit, and is intended for educational purposes only. The image stream data is copyright its respective authors and owners.

###### _I'm just a fan with a code habit._

</div>
