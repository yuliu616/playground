package com.yu.service;

import com.yu.GreetingDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(
        name = "${hello-service.service-name}",
        url = "${hello-service.api-base-url}"
)
public interface HelloService {

    @GetMapping("/hello/hi")
    public GreetingDto hi(@RequestParam(value = "friendName", required = false) String friendName);

    @GetMapping("/hello/friend")
    public int getFriendCount();

    @GetMapping("/hello/forgotten")
    public int getForgottenCount();

    @PostMapping("/hello/do/forgetTheCount")
    public String forgetTheCount();

}
