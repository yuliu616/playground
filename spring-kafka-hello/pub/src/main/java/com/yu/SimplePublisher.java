package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class SimplePublisher {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "HelloTopic";
    private static final int PARTITION = 0;

    public static Logger logger = LoggerFactory.getLogger(SimplePublisher.class);

    public void send() throws Exception {
        logger.info("SimplePublisher: start sending ...");
        kafkaTemplate.send(TOPIC, PARTITION, "firstName", "Peter");
        kafkaTemplate.send(TOPIC, PARTITION, "firstName", "Mary");
        kafkaTemplate.send(TOPIC, PARTITION, "lastName", "Li");
        kafkaTemplate.send(TOPIC, PARTITION, "lastName", "Zhang");
        kafkaTemplate.flush();
        logger.info("SimplePublisher: all sent.");
    }

}
