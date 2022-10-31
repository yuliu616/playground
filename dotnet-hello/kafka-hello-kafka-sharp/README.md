## docker command for testing servers

```sh
# or, use a real ip of your network card
YOUR_IP=127.0.0.1
YOUR_VM_NET=my-net

docker run -d --name zookeeper \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -e ZOOKEEPER_TICK_TIME=2000 \
  -e ZOOKEEPER_SYNC_LIMIT=2 \
  --network ${YOUR_VM_NET} \
  confluentinc/cp-zookeeper:7.0.1

docker run -d --name kafka \
  --network ${YOUR_VM_NET} \
  -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://${YOUR_IP}:9092 \
  -e KAFKA_BROKER_ID=2 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka:5.2.5-10
```

## Dependency

- kafka-sharp: https://github.com/criteo/kafka-sharp
