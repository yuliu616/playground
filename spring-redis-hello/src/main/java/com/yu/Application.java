package com.yu;

import io.lettuce.core.ReadFrom;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

@Configuration
@ComponentScan
@SpringBootApplication
public class Application {

    @Value("${custom.redis.server}")
    private String redisServer;

    @Value("${custom.redis.port}")
    private int redisPort;

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public LettuceConnectionFactory redisConnectionFactory(){
        LettuceClientConfiguration clientConfig = LettuceClientConfiguration.builder()
                .readFrom(ReadFrom.REPLICA_PREFERRED)
                .build();
        RedisStandaloneConfiguration serverConfig = new RedisStandaloneConfiguration(redisServer, redisPort);
        LettuceConnectionFactory factory = new LettuceConnectionFactory(serverConfig, clientConfig);
//        factory.setShareNativeConnection(false); // connection is thread-safe
        return factory;
    }

}
