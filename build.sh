#!/bin/sh

cd build
npm i --omit=dev
cp .env build/.env

pm2 restart all --update-env
