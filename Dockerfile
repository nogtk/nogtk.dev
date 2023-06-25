FROM node:20.3.1-alpine3.17

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

USER $USER_GID:$USER_UID

WORKDIR /home/workspace

COPY --chown=app:app ./package*.json ./
COPY --chown=app:app . .
