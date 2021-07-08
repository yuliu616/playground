package com.yu.controller;

import com.yu.exception.MyValidationException;
import com.yu.model.people.People;
import com.yu.service.PeopleService;
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
    public String slowA(@RequestParam(value = "wait", defaultValue = "1000") int wait){
        waitAwhile(wait);
        return "ok now.";
    }

    @GetMapping("/slow/b")
    public String slowB(@RequestParam(value = "wait", defaultValue = "1000") int wait){
        waitAwhile(wait);
        return "ok now.";
    }

    @GetMapping("/people/{id}")
    public People findPeopleById(@PathVariable("id") String id) {
        logger.info("HelloController: route call to peopleService: findPeopleById({})", id);
        People result = this.peopleService.findPeopleById(id);
        return result;
    }


}
