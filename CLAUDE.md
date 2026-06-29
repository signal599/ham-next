## Background
- The ham-next project is a Next.js rewrite of `haminfo` `Amateur Radio License Map` Drupal project seen here https://github.com/signal599/haminfo and locally at ~/projects/haminfo.
- `haminfo-cli` https://github.com/signal599/haminfo-cli or ~/projects/haminfo-cli is a companion Node application which imports data weekly from the FCC and performs geocoding on newly imported data.
- The database is the old Drupal MySQL database. The tables accessed by ham-next and haminfo-cli are the only tables still in use. They are fcc_license_am, fcc_license_en, fcc_license_hd, ham_address, ham_location and ham_station, ham_station_export. Other Drupal tables will eventually be dropped.

## Commands
- dev: pnpm run dev
- build: pnpm build

## Deployment
- The applications are deployed on a self managed virtual server from Hetzner.
- Deployment is a manual operation. `scripts/deploy.sh` is run manually from the server command line view SSH.