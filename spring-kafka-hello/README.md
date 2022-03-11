# spring-kafka hello

## set up

> assume you have Docker installed.
 
- create docker instance for zookeeper and kafka:

```sh
#create virtual network (if not yet created)
docker network create my-net

docker run -d --name zookeeper \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -e ZOOKEEPER_TICK_TIME=2000 \
  -e ZOOKEEPER_SYNC_LIMIT=2 \
  --network my-net \
  confluentinc/cp-zookeeper:7.0.1

# create kafka with port exposed
docker run -d --name kafka \
  --network my-net \
  -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_BROKER_ID=2 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka:5.2.5-10
```