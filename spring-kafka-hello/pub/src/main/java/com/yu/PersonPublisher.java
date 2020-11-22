package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class PersonPublisher {

    @Autowired
    private KafkaTemplate<String, Person> kafkaTemplate;

    private static final String TOPIC = "HRTopic";
    private static final int PARTITION = 0;

    public static Logger logger = LoggerFactory.getLogger(PersonPublisher.class);

    public void send() throws Exception {
        logger.info("PersonPublisher: start sending ...");
        Person p1 = new Person();
        p1.setFirstName("John");
        p1.setLastName("Smith");
        p1.setAge(34);
        kafkaTemplate.send(TOPIC, PARTITION, "someone", p1);
        kafkaTemplate.flush();
        logger.info("PersonPublisher: all sent.");
    }

}
