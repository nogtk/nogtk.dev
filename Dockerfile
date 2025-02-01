FROM node:20

ENV GROUPNAME=app
ENV USERNAME=app
ENV USER_UID=1100
ENV USER_GID=1100
ENV COREPACK_ENABLE_STRICT=0
ENV YARN_ENABLE_TELEMETRY=0
ENV YARN_ENABLE_IMMUTABLE_INSTALLS=false

# 必要なパッケージのインストールとユーザー作成
RUN apt-get update && apt-get install -y \
  bash \
  python3 \
  make \
  g++ && \
  groupadd -g $USER_GID $GROUPNAME && \
  useradd -m -u $USER_UID -g $GROUPNAME -s /bin/bash $USERNAME && \
  mkdir -p /home/workspace && \
  chown $USERNAME:$GROUPNAME /home/workspace

# corepackを有効化し、必要な権限を設定
RUN corepack enable && \
  corepack prepare yarn@stable --activate && \
  yarn set version stable && \
  chown -R $USERNAME:$GROUPNAME /usr/local/

RUN mkdir -p /home/$USERNAME/.yarn/cache && \
  chown -R $USERNAME:$GROUPNAME /home/$USERNAME/.yarn

WORKDIR /home/workspace

USER $USERNAME

# コンテナ起動時のコマンドは compose.yaml で設定するため、ここでは設定しない
