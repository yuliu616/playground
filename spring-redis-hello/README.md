# spring-redis-hello

## set up

> assume you have Docker installed.

- create docker instance for redis:

```sh
docker run -d --name redis \
  -p 6379:6379 \
  redis:6.2.5
```

# play with it

- set a string in redis

```sh
curl -X POST "http://127.0.0.1:8080/hello/string-set?name=my+friend"
```

- get string value from redis

```sh
curl "http://127.0.0.1:8080/hello/string-get"
```
