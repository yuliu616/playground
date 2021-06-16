package com.yu.service;

import com.yu.model.dto.auth.AuthResultDto;
import com.yu.model.dto.auth.LoginDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;
import java.util.Map;

@FeignClient(
        name = "${auth-service.service-name}",
        url = "${auth-service.api-base-url}"
)
public interface AuthService {

    @GetMapping("/about")
    public Map<String, Object> healthCheck();

    @PostMapping("/login")
    public AuthResultDto login(@RequestBody @Valid LoginDto dto);

}
