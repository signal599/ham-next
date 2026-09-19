---
title: About Amateur Radio License Map
---

## What this site is

The Amateur Radio License Map plots the locations of licensed amateur radio operators in the United States. License data comes from the FCC’s Universal Licensing System and is refreshed weekly. Addresses are geocoded and displayed on an interactive map.

It’s been a fun hobby project of mine since 2018.

## Free resources used

The following free resources make this possible. Thank you to both.

- [OpenFreeMap](https://openfreemap.org/) provides a free map hosting service with data from [OpenStreetMap](https://www.openstreetmap.org/)
- [Geocodio](https://www.geocod.io/) is a commercial geocoding service which has a generous free tier and flexible terms of service.

My only cost is the server at Hetzner at about $15 per month which I use for other things anyway and a small donation to the creator and maintainer of OpenFreeMap.

## Data use and accuracy

Locations are derived from the mailing address on each license which is not always where the station is actually operated from. Treat the map as a rough guide rather than a precise record. Many license holders are not active in the hobby so a marker on the map doesn’t necessarily mean that any signals are radiating from that location.

Don’t leap to conclusions if you’re using the map to search for a source of interference. Even if a nearby amateur radio operator is the source of interference to domestic electronic equipment, the technical deficiency is usually with the home equipment, not with the transmitter.

## How it works

The site is a Next.js application. A companion Node.js command line app downloads the FCC data and geocodes the addresses. See the [Blog](/blog) for the story of how it was built and what has changed along the way. It's all open source. The code can be seen on GitHub [here](https://github.com/signal599/ham-next) and [here](https://github.com/signal599/haminfo-cli).

## Contact

Questions, corrections and suggestions are welcome.

73, Ross KT1F  
Email: ross (at) earthbubble.com
