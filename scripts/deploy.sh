#!/bin/bash
git pull
pnpm build
pm2 reload hamnext
