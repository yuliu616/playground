package com.yu.service;

import com.yu.model.property.Property;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "${property-service.service-name}",
        url = "${property-service.service-url}"
)
@RequestMapping("${property-service.api-base-url}")
public interface PropertyService {

    @GetMapping("/property/{id}")
    public Property findPropertyById(@PathVariable("id") String id);

    @GetMapping("/property")
    public List<Property> listAllProperty(
            @RequestParam(value = "offset", defaultValue = "0") long offset,
            @RequestParam(value = "size", defaultValue = "10") long size
    );

}
