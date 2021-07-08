package com.yu.feign;

import feign.RequestInterceptor;
import feign.RequestTemplate;

public class HardcodedFeignRequestInterceptor implements RequestInterceptor {

    private static String ACCESS_TOKEN = "eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJjb20ueXUiLCJyb2xlIjpbIlJPT1RfQURNSU4iXSwiZXhwIjoxOTI1ODA3MTYxLCJ1c2VybmFtZSI6InVzZXIxMDAxIn0.zo7FhCEVhc5A8gBMDSmX06FgVtwbvsg5wEc8EJAJNMiksCsAoHEBCuzOrupk3kdcxVUsGg1Ig-nvHkQ5m7O-2g";

    @Override
    public void apply(RequestTemplate requestTemplate) {
        requestTemplate.header("Authorization", "Bearer "+ACCESS_TOKEN);
    }

}
