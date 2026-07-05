#!/bin/bash
git pull
pnpm i
rm -rf .next
pnpm build
pm2 reload hamnext
