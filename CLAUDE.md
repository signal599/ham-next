## Background
- The ham-next project is a Next.js application which provides an interactive map showing the locations of licensed amateur radio operators in the
United States. A companion app haminfo-cli downloads data from the FCC and performs geocoding.

## Commands
- dev: pnpm run dev
- build: pnpm build

## Deployment
- The applications are deployed on a self managed virtual server at Hetzner. Apache is used to proxy requests to the app which runs with pm2.
- Deployment is a manual operation. `scripts/deploy.sh` is run manually from the server command line view SSH.

## Repository
- The code is on GitHub at https://github.com/signal599/ham-next
