FROM node:20.3.1-alpine3.17

RUN yarn global add firebase-tools && \
  apk add bash

WORKDIR /home/app

COPY ./package*.json ./
COPY . .
