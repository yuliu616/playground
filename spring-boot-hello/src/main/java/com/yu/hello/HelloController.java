package com.yu.hello;

import com.yu.exception.InconsistencyDataException;
import com.yu.exception.RecordNotFoundException;
import com.yu.model.Family;
import com.yu.model.Gender;
import com.yu.model.People;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("${apiMeta.path}")
public class HelloController {

    @Value("${hello.serviceName}")
    protected String appServiceName;

    @Value("${spring.profiles}")
    protected String springProfilesString;

    @Value("${hello.age}")
    private int age = 40;

    private static Logger logger = LoggerFactory.getLogger(HelloController.class);

    @ExceptionHandler(RecordNotFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> failByRecordNotFound(RecordNotFoundException exception){
        return Collections.singletonMap("errorCode", "RECORD_NOT_FOUND");
    }

    @ExceptionHandler(InconsistencyDataException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> failByRecordNotFound(InconsistencyDataException exception){
        return Collections.singletonMap("errorCode", "DATA_INCONSISTENCY");
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/version",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> appVersion(){
        logger.debug("appVersion:[{}].", this.appServiceName);
        Map<String, Object> map = new HashMap<>();
        map.put("serviceName", this.appServiceName);
        map.put("springProfiles", this.springProfilesString);
        map.put("currentTime", Instant.now());
        return map;
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/hi",
            produces = MediaType.TEXT_PLAIN_VALUE)
    public String sayHi(){
        logger.info("someone say hi to me !!!");
        return "hello, i am spring boot hello.";
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/dummyPerson",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People dummyPerson(){
        try {
            People p = new People();
            p.setId(10123);
            p.setFirstName("Peter");
            p.setLastName("Chan");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dob = LocalDate.parse("2017-10-23", formatter);
            dob = dob.minus(this.age, ChronoUnit.YEARS);
            logger.info("dob = {}", formatter.format(dob));
            p.setDateOfBirth(dob);
            return p;
        } catch (DateTimeParseException ex) {
            logger.error("error parsing", ex);
            return null;
        }
    }

}

