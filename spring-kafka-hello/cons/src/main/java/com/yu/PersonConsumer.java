package com.yu;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.stereotype.Component;

@Component
public class PersonConsumer {

    public static Logger logger = LoggerFactory.getLogger(PersonConsumer.class);

    public static final String TOPIC = "HRTopic";
    private static final String PARTITION = "0";

    @KafkaListener(topicPartitions = {
            @TopicPartition(topic = TOPIC, partitions = { PARTITION })
    })
    public void onKafkaMessage(ConsumerRecord<String, Person> record){
        logger.info("PersonConsumer: got Person from kafka: {} : name is {},{} with age {}",
                record.key(),
                record.value().getFirstName(),
                record.value().getLastName(),
                record.value().getAge());
    }

}
