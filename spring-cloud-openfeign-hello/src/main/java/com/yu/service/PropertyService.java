package com.yu.service;

import com.yu.model.property.Property;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.util.Map;

@FeignClient(
        name = "${property-service.service-name}",
        url = "${property-service.api-base-url}"
)
public interface PropertyService {

    @GetMapping("/about")
    public Map<String, Object> healthCheck();

    @PostMapping("/property")
    public Property createProperty(@RequestBody @Valid Property property);

}
