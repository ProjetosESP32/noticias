FROM node:lts-slim AS base
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
RUN apt-get update
RUN apt-get install -y \
  python3 \
  python3-pip \
  build-essential
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm i
COPY --chown=node:node . .
RUN pip install instaloader

FROM dependencies AS build
RUN node ace build --production

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm i --omit=dev
COPY --chown=node:node --from=build /home/node/app/build .
RUN node ace migration:run --force
RUN node ace db:seed
EXPOSE $PORT
CMD [ "node", "server.js" ]
