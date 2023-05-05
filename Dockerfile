FROM node:20.1.0-alpine3.17

RUN yarn global add firebase-tools && \
  apk add bash
