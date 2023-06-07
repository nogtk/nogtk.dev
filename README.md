This is the repository for my blog([nogtk.dev](https://nogtk.dev/)) code.

### How to develop on local
```sh
$ docker compose build --no-cache
$ docker compose up

$ curl -I -s localhost:3000 | grep HTTP/ | awk '{print $2}'
200
```
