# 🏎️ F1

Scrapes a live photo every ~30 minutes of the Formula 1 race track's build
progression in Las Vegas, NV. Scheduled completion is October 2023, a month
before the race begins.

## Summary

The data source on the scraped images is an updating live photo feed sourced
from the official Formula 1 website. As long as it remains up and transmitting
data, this project will continue to auto-update.

The photos are automatically pushed to the `./assets` folder of this repository,
and will be stitched together into a timelapse video at the end of the project.

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

•••

###### _I'm just a fan with a code habit._

</div>
