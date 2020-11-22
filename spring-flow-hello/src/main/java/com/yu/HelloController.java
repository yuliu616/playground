package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.Random;
import java.util.concurrent.SubmissionPublisher;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @Autowired
    protected StuffSubscriber subscriber;

    @Autowired
    protected CharArrayCounter counter;

    protected SubmissionPublisher<String> publisher = new SubmissionPublisher<String>();

    private static Logger logger = LoggerFactory.getLogger(HelloController.class);

    @PostConstruct
    public void init(){
        logger.error("publisher.subscribe.");
        this.publisher.subscribe(this.subscriber);
    }

    @RequestMapping(method = RequestMethod.POST,
                path = "/hihi",
                produces = MediaType.TEXT_PLAIN_VALUE)
    public String sayHi(@RequestBody String data){
        logger.debug("hihi. data={}.", data);
        this.subscriber.demandSubscriptionRequest(1);
        this.publisher.submit("00."+data);
        return "hello, data sent. count="+this.subscriber.counter.get();
    }

//    @RequestMapping(method = RequestMethod.POST,
//                path = "/hehe",
//                produces = MediaType.TEXT_PLAIN_VALUE)
//    public String sayHe(@RequestBody String data){
//        logger.debug("hehe. data={}.", data);
//        this.counter.setBase(data.length());
//        return "hehe, base="+this.counter.getBase();
//    }

    @RequestMapping(method = RequestMethod.POST,
                path = "/stress",
                produces = MediaType.TEXT_PLAIN_VALUE)
    public String callItManyTimes(@RequestBody String data){
        // create many threads and send data to the publisher.
        logger.debug("callItManyTimes. data={}.", data);
        this.subscriber.demandSubscriptionRequest(100*100_000);
        for (int i=0;i<50;i++) {
            final int index = i;
//            logger.debug("i++");
            new Thread(() -> {
                try {
                    Thread.sleep(new Random().nextInt(500));
                } catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
                for (int j=0;j<100_000;j++) {
//                    logger.debug("j++");
                    if (index < 10) {
                        this.publisher.submit("0"+Integer.toString(index)+"."+data);
                    } else if (index < 100){
                        this.publisher.submit(Integer.toString(index)+"."+data);
                    } else {
                        logger.error("error in stress routine.");
                        throw new RuntimeException();
                    }
                }
            }).start();
        }
        return "see the logs";
    }

}
