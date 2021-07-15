package com.yu.controller;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import com.yu.exception.MyValidationException;
import com.yu.model.people.People;
import com.yu.model.property.Property;
import com.yu.service.PeopleService;
import com.yu.service.PropertyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/1.0/hello")
public class HelloController {

    @Autowired
    protected PeopleService peopleService;

    @Autowired
    protected PropertyService propertyService;

    @Autowired
    protected CurrentTimeController currentTimeController;

    private static final Logger logger = LoggerFactory.getLogger(HelloController.class);

    @GetMapping("/hi")
    public String hi(){
        return "hello.";
    }

    @GetMapping("/time")
    public Instant getTime(){
        return currentTimeController.getCurrentTime();
    }

    @GetMapping("/lucky")
    @HystrixCommand(
//        commandProperties={
//            @HystrixProperty(name = "circuitBreaker.enabled", value = "true"),
//            @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "3"),
//            @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "50"),
//            @HystrixProperty(name = "circuitBreaker.sleepWindowInMilliseconds", value = "10000"),
//            @HystrixProperty(name = "circuitBreaker.forceOpen", value = "false"),
//        }
    )
    public String lucky(){
        if (Math.random() < 0.5) {
            throw new RuntimeException("sorry, you are bad luck.");
        } else {
            return "you are lucky, at this moment.";
        }
    }

    private void waitAwhile(int wait){
        if (wait <= 0) {
            throw new MyValidationException("invalid input");
        }
        logger.info("HelloController: slow waiting ...");
        try {
            Thread.sleep(wait);
        } catch (InterruptedException ex) {
            logger.error("InterruptedException", ex);
            throw new RuntimeException(ex);
        }
        logger.info("HelloController: slow waiting ... done");
    }

    @GetMapping("/slow/a")
    @HystrixCommand(fallbackMethod = "slowFallback",
        ignoreExceptions = { MyValidationException.class }
//        commandProperties={
//                @HystrixProperty(name = "execution.timeout.enabled", value="true"),
//                @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value="6000"),
//        }
    )
    public String slowA(@RequestParam(value = "wait", defaultValue = "1000") int wait){
        waitAwhile(wait);
        return "ok now.";
    }

    @GetMapping("/slow/b")
    @HystrixCommand(
//        commandProperties={
//            @HystrixProperty(name = "execution.timeout.enabled", value="true"),
//            @HystrixProperty(name = "execution.isolation.semaphore.maxConcurrentRequests", value = "2"),
//            @HystrixProperty(name = "execution.isolation.strategy", value = "SEMAPHORE"),
//        }
    )
    public String slowB(@RequestParam(value = "wait", defaultValue = "1000") int wait){
        waitAwhile(wait);
        return "ok now.";
    }

    public String slowFallback(int wait, Throwable causeOfFallback){
        logger.warn("hystrix: fallback invoked.", causeOfFallback);
        String message;
        if (causeOfFallback instanceof javax.validation.ValidationException) {
            message = "Validation";
        } else if (causeOfFallback instanceof com.netflix.hystrix.exception.HystrixTimeoutException) {
            message = "HystrixTimeout";
        } else if (causeOfFallback instanceof java.lang.RuntimeException &&
                causeOfFallback.getMessage().equals("could not acquire a semaphore for execution"))
        {
            message = "caused by maxConcurrentRequests";
        } else if (causeOfFallback instanceof java.lang.RuntimeException &&
                causeOfFallback.getMessage().equals("Hystrix circuit short-circuited and is OPEN"))
        {
            message = "caused by circuit OPEN";
        } else {
            message = "anyway";
        }
        return "hystrix fallback occurred: "+message;
    }

    @GetMapping("/people/{id}")
    @HystrixCommand(
//        commandProperties={
//            @HystrixProperty(name = "execution.timeout.enabled", value="true"),
//            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value="10"),
//        }
    )
    public People findPeopleById(@PathVariable("id") String id) {
        logger.info("HelloController: route call to peopleService: findPeopleById({})", id);
        People result = this.peopleService.findPeopleById(id);
        return result;
    }

    @GetMapping("/property/{id}")
    public Property findPropertyById(@PathVariable("id") String id) {
        logger.info("HelloController: route call to propertyService: findPropertyById({})", id);
        Property result = this.propertyService.findPropertyById(id);
        return result;
    }

}
