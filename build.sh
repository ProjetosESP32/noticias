#!/bin/sh

cp .env build/.env

cd build
npm i --omit=dev

pm2 restart all --update-env
