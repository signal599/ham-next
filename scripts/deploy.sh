#!/bin/bash
git pull
pnpm i
pnpm build
pm2 reload hamnext
