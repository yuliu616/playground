package com.yu;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public Map<String, Object> producerConfig(){
        Map<String, Object> prop = new HashMap<>();
        prop.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return prop;
    }

    @Bean
    public ProducerFactory<String, String> producerFactory(){
        // to use spring parameter defined producerConfig,
        // just provide a blank map here.
        // Map<String, Object> producerConfig = new HashMap<>();
        Map<String, Object> producerConfig = this.producerConfig();
        producerConfig.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        producerConfig.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return new DefaultKafkaProducerFactory<String, String>(producerConfig);
    }

    @Bean
    public ProducerFactory<String, Person> producerFactoryForPerson(){
        Map<String, Object> producerConfig = this.producerConfig();
        producerConfig.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        producerConfig.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<String, Person>(producerConfig);
    }

    @Bean
    private KafkaTemplate<String, String> kafkaTemplate(){
        boolean autoFlash = false;
        return new KafkaTemplate<>(this.producerFactory(), autoFlash);
    }

    @Bean
    private KafkaTemplate<String, Person> kafkaTemplateForPerson(){
        boolean autoFlash = false;
        return new KafkaTemplate<>(this.producerFactoryForPerson(), autoFlash);
    }

}
