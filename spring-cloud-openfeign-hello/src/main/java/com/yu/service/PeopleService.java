package com.yu.service;

import com.yu.model.people.People;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.util.Map;

@FeignClient(
        name = "${people-service.service-name}",
        url = "${people-service.api-base-url}"
)
public interface PeopleService {

    @GetMapping("/about")
    public Map<String, Object> healthCheck();

    @PostMapping("/people")
    public People createPeople(@RequestBody @Valid People people);

}
