package com.yu;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.stereotype.Component;

@Component
public class SimpleConsumer {

    public static Logger logger = LoggerFactory.getLogger(SimpleConsumer.class);

    public static final String TOPIC = "HelloTopic";
    private static final String PARTITION = "0";

    @KafkaListener(topicPartitions = {
            @TopicPartition(topic = TOPIC, partitions = { PARTITION })
    })
    public void onKafkaMessage(ConsumerRecord<String, String> record){
        logger.info("SimpleConsumer: got message from kafka: {} : {}", record.key(), record.value());
    }

}
