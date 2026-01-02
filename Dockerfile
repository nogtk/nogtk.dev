FROM node:24.1.0-alpine3.20

ENV GROUPNAME=app
ENV USERNAME=app
ENV USER_UID=1100
ENV USER_GID=1100

RUN apk add bash make g++ && \
  addgroup -S --gid $USER_GID $GROUPNAME && \
  adduser -S --uid $USER_UID $USERNAME -G $GROUPNAME -s /bin/bash && \
  mkdir -p /home/workspace && \
  chown app:app /home/workspace

RUN apk add python3

RUN corepack enable

USER $USER_GID:$USER_UID

WORKDIR /home/workspace

COPY --chown=app:app ./package.json ./yarn.lock ./.yarnrc.yml ./
RUN corepack install
COPY --chown=app:app . .
RUN yarn install --immutable
