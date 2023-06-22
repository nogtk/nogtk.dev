FROM node:20.1.0-alpine3.17

ENV GROUPNAME=app
ENV USERNAME=app
ENV USER_UID=1100
ENV USER_GID=1100

RUN addgroup -S --gid $USER_GID $GROUPNAME && \
  adduser -S --uid $USER_UID $USERNAME -G $GROUPNAME && \
  mkdir -p /home/workspace && \
  chown app:app /home/workspace && \
  apk add bash

USER $USER_GID:$USER_UID

WORKDIR /home/workspace

RUN yarn global add firebase-tools

COPY --chown=app:app ./package*.json ./
COPY --chown=app:app . .
