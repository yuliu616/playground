package com.yu;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @Value("${hello-app.greeting}")
    protected String greetingWord;

    @Value("${hello-app.friend-limit}")
    protected int friendLimit;

    @Value("${hello-app.excuse-for-rejecting-new-friend}")
    protected String excuseForRejectingNewFriend;

    private AtomicInteger friendCounter = new AtomicInteger(0);

    @GetMapping("/hi")
    public GreetingDto hi(@RequestParam(value = "friendName", required = false) String friendName){
        if (this.friendCounter.get() >= this.friendLimit) {
            return new GreetingDto(this.friendCounter.get(), excuseForRejectingNewFriend, false);
        } else {
            int friendCount = this.friendCounter.addAndGet(1);
            if (friendCount == 1) {
                if (StringUtils.hasLength(friendName)) {
                    return new GreetingDto(friendCount, "wonderful, "+friendName+", you are my first friend !!", true);
                } else {
                    return new GreetingDto(friendCount, "wonderful, you are my first friend !!", true);
                }
            } else {
                if (StringUtils.hasLength(friendName)) {
                    return new GreetingDto(friendCount, greetingWord+", "+friendName+", you are my friend.", true);
                } else {
                    return new GreetingDto(friendCount, greetingWord+", you are my friend.",true);
                }
            }
        }
    }

}
