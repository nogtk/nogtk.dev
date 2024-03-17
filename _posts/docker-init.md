---
title: "Docker init コマンドを試してみる"
excerpt: "docker init コマンドが GA となったことを知ったので、手を動かしてみました。"
date: "2024-03-14"
---

## 動機

以下の記事を見て docker init コマンドが GA となったことを知ったので、手を動かしてみたくなりました。

https://www.publickey1.jp/blog/24/dockerdocker_initdockerfilecompose.html

公式の記事はこちら。

https://www.docker.com/blog/streamline-dockerization-with-docker-init-ga/

## 公式ドキュメント

https://docs.docker.com/reference/cli/docker/init/

docker init を実行することで対話型のシェルが起動し、以下の 4 つのファイルが生成されるようです。

- .dockerignore
- Dockerfile
- compose.yaml
- README.Docker.md

またこれらのファイルが存在する場合は、上書きされるようなので、注意が必要ということも書いてありました。（大抵は Git 管理しているので問題なさそう）

## 実行

筆者の環境では docker 24.0.7 を使っています。

```sh
$ docker -v
Docker version 24.0.7, build afdd53b
```

では実行してみます。

### 何もないディレクトリで実行する場合　

```sh
$ docker init

Welcome to the Docker Init CLI!

This utility will walk you through creating the following files with sensible defaults for your project:
  - .dockerignore
  - Dockerfile
  - compose.yaml

Let's get started!

? What application platform does your project use?  [Use arrows to move, type to filter]
  Go - suitable for a Go server application
  Python - suitable for a Python server application
  Node - suitable for a Node server application
> Other - general purpose starting point for containerizing your application
  Don't see something you need? Let us know!
  Quit
```

このような対話型のシェルが起動しました。何もないディレクトリで実行したからか、最初は Other が選択された状態で起動しています。また、対応言語に Rust や Java、ASP.NET などもありましたが、このケースだと表示されていませんでした。一旦、Other を選択してみます。

```sh
$ ls
Dockerfile	compose.yaml
```

Dockerfile / compose.yaml の 2 つが生成されています。

```sh
$ cat Dockerfile

# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

################################################################################
# Pick a base image to serve as the foundation for the other build stages in
# this file.
#
# For illustrative purposes, the following FROM command
# is using the alpine image (see https://hub.docker.com/_/alpine).
# By specifying the "latest" tag, it will also use whatever happens to be the
# most recent version of that image when you build your Dockerfile.
# If reproducability is important, consider using a versioned tag
# (e.g., alpine:3.17.2) or SHA (e.g., alpine:sha256:c41ab5c992deb4fe7e5da09f67a8804a46bd0592bfdf0b1847dde0e0889d2bff).
FROM alpine:latest as base

################################################################################
# Create a stage for building/compiling the application.
#
# The following commands will leverage the "base" stage above to generate
# a "hello world" script and make it executable, but for a real application, you
# would issue a RUN command for your application's build process to generate the
# executable. For language-specific examples, take a look at the Dockerfiles in
# the Awesome Compose repository: https://github.com/docker/awesome-compose
FROM base as build
COPY <<EOF /bin/hello.sh
#!/bin/sh
echo Hello world from $(whoami)! In order to get your application running in a container, take a look at the comments in the Dockerfile to get started.
EOF
RUN chmod +x /bin/hello.sh

################################################################################
# Create a final stage for running your application.
#
# The following commands copy the output from the "build" stage above and tell
# the container runtime to execute it when the image is run. Ideally this stage
# contains the minimal runtime dependencies for the application as to produce
# the smallest image possible. This often means using a different and smaller
# image than the one used for building the application, but for illustrative
# purposes the "base" image is used here.
FROM base AS final

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser
USER appuser

# Copy the executable from the "build" stage.
COPY --from=build /bin/hello.sh /bin/

# What the container should run when it is started.
ENTRYPOINT [ "/bin/hello.sh" ]
```

```
$ cat compose.yaml
cat compose.yaml
# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Docker compose reference guide at
# https://docs.docker.com/compose/compose-file/

# Here the instructions define your application as a service called "app".
# This service is built from the Dockerfile in the current directory.
# You can add other services your application may depend on here, such as a
# database or a cache. For examples, see the Awesome Compose repository:
# https://github.com/docker/awesome-compose
services:
  app:
    build:
      context: .
      target: final
    # If your application exposes a port, uncomment the following lines and change
    # the port numbers as needed. The first number is the host port and the second
    # is the port inside the container.
    # ports:
    #   - 8080:8080

    # The commented out section below is an example of how to define a PostgreSQL
    # database that your application can use. `depends_on` tells Docker Compose to
    # start the database before your application. The `db-data` volume persists the
    # database data between container restarts. The `db-password` secret is used
    # to set the database password. You must create `db/password.txt` and add
    # a password of your choosing to it before running `docker compose up`.
    #     depends_on:
    #       db:
    #         condition: service_healthy
    #   db:
    #     image: postgres
    #     restart: always
    #     user: postgres
    #     secrets:
    #       - db-password
    #     volumes:
    #       - db-data:/var/lib/postgresql/data
    #     environment:
    #       - POSTGRES_DB=example
    #       - POSTGRES_PASSWORD_FILE=/run/secrets/db-password
    #     expose:
    #       - 5432
    #     healthcheck:
    #       test: [ "CMD", "pg_isready" ]
    #       interval: 10s
    #       timeout: 5s
    #       retries: 5
    # volumes:
    #   db-data:
    # secrets:
    #   db-password:
    #     file: db/password.txt
```

`docker compose up --build` で実行すると、build, run が走り、/bin/hello.sh として COPY された文字列が stdout に出力されている事が確認できました。

```
[+] Running 2/1
 ✔ Network test_default  Created                                                                        0.0s
 ✔ Container test-app-1  Created                                                                        0.0s
Attaching to app-1
app-1  | Hello world from appuser! In order to get your application running in a container, take a look at the comments in the Dockerfile to get started.
app-1 exited with code 0
````

Dockerfile をみると、alpine の最新イメージを使いながらマルチステージビルドを行っていることがわかります。一定 Dockerfile のベストプラクティスとされるものに沿って生成されている点が良いですね。USER の作成もコメントとしてベストプラクティスのリンクが貼られており、ここらの情報は作成したときには調べて適用しても後から見返したときになぜそういうコマンドになっているか忘れていたりもするので、こういったコメントが自動で付与される点はありがたいです。

### 既存のディレクトリで実行する場合
今回は、Kotlin のプロジェクトを対象に作成してみます。

Spring initializr で適当なプロジェクトを作成しました。

https://github.com/nogtk/spring-docker-init

こちらのディレクトリ上に docker init を実行してみます。
ですが、Java が選択肢に出てこなかったので調べたところ

> 最初の init ベータリリースでは、Goプロジェクトと汎用プロジェクトのみがサポートされていました。 最新バージョンは、Docker Desktop 4で入手できます。27は、Go、Python、Node.js、Rust、ASP.NET、PHP、および Java。

ref: https://www.docker.com/ja-jp/blog/streamline-dockerization-with-docker-init-ga/

ということで、現在のバージョンだとサポート外ということで、バージョンをあげてみます。
すると、Javaをはじめいくつかの選択肢が追加されています。

```
Let's get started!

WARNING: The following Docker files already exist in this directory:
  - .dockerignore
  - Dockerfile
  - compose.yaml

? Do you want to overwrite them? Yes
? What application platform does your project use?  [Use arrows to move, type to filter]
  Go - suitable for a Go server application
  Python - suitable for a Python server application
  Node - suitable for a Node server application
  Rust - suitable for a Rust server application
  ASP.NET Core - suitable for an ASP.NET Core application
  PHP with Apache - suitable for a PHP web application
  Java - suitable for a Java application that uses Maven and packages as an uber jar
> Other - general purpose starting point for containerizing your application
  Don't see something you need? Let us know!
  Quit
  ```

こんな感じで、ポートや Java のバージョンを聞かれます。

  ```
  ? What application platform does your project use? Java
X Sorry, your reply was invalid: you must specify a relative path with a leading '.' that does not escape its parent directory (e.g. './example')
? What's the relative directory (with a leading .) for your app? ./src
? What version of Java do you want to use? 17
? What port does your server listen on? 8080

CREATED: .dockerignore
CREATED: Dockerfile
CREATED: compose.yaml
CREATED: README.Docker.md

✔ Your Docker files are ready!
```

追加されたファイルはこちらを参照ください。

https://github.com/nogtk/spring-docker-init/commit/794a9c8ae42570318d60117b05e1e4bd3b65dc1d

現状は maven のみに対応しているようで、Gradle で作成したプロジェクトには対応していないようです。今後に期待です。
