#!/bin/sh

cp /home/bitnami/.env /home/bitnami/noticias/build/.env

npm i /home/bitnami/noticias/build --omit=dev

pm2 restart all --update-env
