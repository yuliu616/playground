package com.yu;

import com.alibaba.fastjson.JSON;
import com.yu.model.dto.auth.AuthResultDto;
import com.yu.model.dto.auth.LoginDto;
import com.yu.model.people.Gender;
import com.yu.model.people.People;
import com.yu.model.property.Property;
import com.yu.service.AuthService;
import com.yu.service.PeopleService;
import com.yu.service.PropertyService;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class HelloTask implements CommandLineRunner {

    @Value("${hello.auth.username}")
    protected String username;

    @Value("${hello.auth.password}")
    protected String password;

    @Autowired
    protected AuthService authService;

    @Autowired
    protected PeopleService peopleService;

    @Autowired
    protected PropertyService propertyService;

    private static String accessToken;

    public static String getAccessToken() {
        return accessToken;
    }

    private static Logger logger = LoggerFactory.getLogger(HelloTask.class);

    @Override
    public void run(String... args) throws Exception {
        try {
            // check all services availabilities
            logger.info("authService.healthCheck: {}", JSON.toJSON(authService.healthCheck()));
            logger.info("peopleService.healthCheck: {}", JSON.toJSON(peopleService.healthCheck()));
            logger.info("propertyService.healthCheck: {}", JSON.toJSON(propertyService.healthCheck()));

            // login
            LoginDto login = new LoginDto();
            login.setUsername(username);
            login.setPassword(password);
            AuthResultDto loginRes = authService.login(login);
            logger.info("login result = {}", JSON.toJSONString(loginRes));
            HelloTask.accessToken = loginRes.access_token;

            // create people (as owner of the property)
            People owner = new People();
            owner.setFirstName("Wang");
            owner.setLastName("Xixi");
            owner.setNickname("Nothing but beautiful");
            owner.setGender(Gender.FEMALE);
            logger.info("ownerBeforeCreated = {}", JSON.toJSONString(owner));
            People ownerCreated = peopleService.createPeople(owner);
            logger.info("ownerCreated = {}", JSON.toJSONString(ownerCreated));

            // create property with this owner
            Property property = new Property();
            property.setName("Grand Tower");
            property.setAddrCity("New York");
            property.setAddrCountryCode("us");
            property.setOwnerId(ownerCreated.getId());
            property.setOwnershipDate(LocalDate.now());
            logger.info("propertyBeforeCreated = {}", JSON.toJSONString(property));
            Property propertyCreated = propertyService.createProperty(property);
            logger.info("propertyCreated = {}", JSON.toJSONString(propertyCreated));
        } catch (FeignException feignException) {
            logger.error("feignException while calling {} {}",
                    feignException.request().httpMethod(), feignException.request().url(),
                    feignException);
            throw feignException;
        }
    }

}
