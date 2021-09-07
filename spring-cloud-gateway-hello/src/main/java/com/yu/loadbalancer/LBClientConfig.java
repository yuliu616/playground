package com.yu.loadbalancer;

import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClients;
import org.springframework.context.annotation.Configuration;

@Configuration
@LoadBalancerClients({
        @LoadBalancerClient(name = "auth-service", configuration = CustomLoadBalancerConfiguration.class),
})
public class LBClientConfig {

}
