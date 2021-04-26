package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
public class AppSecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("${hello.api-base-url}")
    protected String urlPrefixForEndpoints;

    private static final Logger logger = LoggerFactory.getLogger(AppSecurityConfig.class);

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        logger.info("API endpoint prefix=[{}].", this.urlPrefixForEndpoints);

        // ensure the service is completely stateless (and never set cookie)
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.NEVER);

        http.csrf().disable();

        // just open for all access
        http.authorizeRequests()
            .anyRequest()
            .permitAll();

//        http.authorizeRequests()
//                .antMatchers(HttpMethod.GET, "/delete")
//                .hasAnyAuthority("admin", "manager");
    }
}
