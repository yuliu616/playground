package com.yu.feign;

import com.yu.HelloTask;
import feign.RequestInterceptor;
import feign.RequestTemplate;

public class CommonRequestInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate requestTemplate) {
        // RequestInterceptor wont support injection, just use static method
        // as work-around for this hello world.
        String accessToken = HelloTask.getAccessToken();
        if (accessToken != null) {
            requestTemplate.header("Authorization", "Bearer "+accessToken);
        }
    }

}
