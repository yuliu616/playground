package com.yu.service;

import com.yu.model.people.People;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;
import java.util.List;

@FeignClient(
    name = "${people-service.service-name}",
    url = "${people-service.service-url}"
)
@RequestMapping("${people-service.api-base-url}")
public interface PeopleService {

    @GetMapping("/people/{id}")
    public People findPeopleById(@PathVariable("id") String id);

    @GetMapping("/people")
    public List<People> listAllPeople(
            @RequestParam(value = "offset", defaultValue = "0") long offset,
            @RequestParam(value = "size", defaultValue = "10") long size
    );

    @GetMapping("/people/search/withIdList")
    public List<People> listPeopleByIdList(
            @RequestParam("idList") String idListStr
    );

    @PostMapping("/people")
    public People createPeople(@RequestBody @Valid People people);

    @PutMapping("/people/{id}")
    public People updatePeopleById(@PathVariable("id") String id,
                                   @RequestBody @Valid People people);

}
