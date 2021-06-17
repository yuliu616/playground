package com.yu;

import com.yu.service.HelloService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController()
@RequestMapping("/nice")
public class NiceController {

    @Autowired
    protected HelloService helloService;

    private static Logger logger = LoggerFactory.getLogger(NiceController.class);

    private static int ENSURE_FRIEND_RETRY_LIMIT = 1000;

    @GetMapping("/hi")
    public String hi(){
        return "hi, the time is now "+ Instant.now().toString();
    }

    @GetMapping("/friend")
    public int getFriendCount(){
        return helloService.getFriendCount();
    }

    @PostMapping("/friend/{count}")
    public String addFriend(@PathVariable("count") int count) {
        logger.info("addFriend x {} ...", count);
        for (int i=0;i<count;i++) {
            logger.info("addFriend i={}.", i);
            helloService.hi("anyway");
        }
        logger.info("addFriend x {} ... done", count);
        return "you now have "+helloService.getFriendCount()+" friend(s).";
    }

    @PostMapping("/friend/{count}/exact")
    public String ensureFriendCountExactAs(@PathVariable("count") int count) {
        int operationCount = 0;
        for (int i=0;i<ENSURE_FRIEND_RETRY_LIMIT;i++) {
            if (helloService.getFriendCount() > count) {
                logger.info("forgetFriend i={}.", i);
                helloService.forgetTheCount();
                operationCount++;
            }
            int friendCount = helloService.getFriendCount();
            if (friendCount == count) {
                return "friend count is now "+friendCount+", after "+operationCount+" operations.";
            } else if (friendCount < count) {
                logger.info("addFriend i={}.", i);
                helloService.hi("anyway");
                operationCount++;
            }
        }
        return "failed to make friend count as you asked, friend count is now "+helloService.getFriendCount();
    }

}
