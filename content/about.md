---
title: About Amateur Radio License Map
---

## What this site is

The Amateur Radio License Map plots the locations of licensed amateur radio operators in the United States License data comes from the FCC's Universal Licensing System and is refreshed weekly. Addresses are geocoded and displayed on an interactive map.

It's been a fun hobby project of mine since 2018.

## How it works

The site is a Next.js application. A companion Node.js command line app downloads the FCC data and geocodes the addresses. See the [Blog](/blog) for the story of how it was built and what has changed along the way. It's all open source. The code can be seen on GitHub [here](https://github.com/signal599/ham-next) and [here](https://github.com/signal599/haminfo-cli).

## Free resources used

The following free resources make this possible. Thank you to both.

- [OpenFreeMap](https://openfreemap.org/) provides a free map hosting service with data from [OpenStreetMap](https://www.openstreetmap.org/)
- [Geocodio](https://www.geocod.io/) is a commercial geocoding service which has a generous free tier and flexible terms of service.

My only cost is the server at Hetzner at about $15 per month which I use for other things anyway and a small donation to OpenFreeMap.

## Data and accuracy

Locations are derived from the mailing address on each licence, which is not always where the station is actually operated from. Treat the map as a rough guide rather than a precise record.

## Contact

Questions, corrections and suggestions are welcome.

73, Ross KT1F  
Email: ross (at) earthbubble.com
