package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Random;
import java.util.concurrent.Flow;

@Component
public class StuffSubscriber implements Flow.Subscriber<String> {

    private Flow.Subscription subscription;
    private Random random = new Random();
//    private String lastDigest;

    @Autowired
    protected CharArrayCounter counter;

    private static Logger logger = LoggerFactory.getLogger(StuffSubscriber.class);

    @Override
    public void onSubscribe(Flow.Subscription subscription) {
        this.subscription = subscription;
//        counter.set(0);
    }

    public void demandSubscriptionRequest(long requestCount){
        // how many items it will consume.
        this.subscription.request(requestCount);
    }

    @Override
    public void onNext(String item) {
//        String digest;
//        if (this.lastDigest == null) {
//            digest = DigestUtil.digestString(item);
//        } else {
//            String raw = this.lastDigest+item;
//            digest = DigestUtil.digestString(raw);
//        }
//        this.lastDigest = digest;

        int index = Integer.parseInt(item.substring(0,2));
        counter.add(item, index);
        var invokedCount = counter.getInvokedCount();
        if (invokedCount % 10_000 == 0) {
            logger.info("got [{}] buffer={}, invokedCount={}.",
                    item, counter.get(), invokedCount);
        }

//        var newCount = counter.addAndGet(item.length());
//        var invokedCount = counter.getInvokedCount();
//        if ((newCount % 480 == 0 && invokedCount % 3_000_000 == 0) ||
//            invokedCount % 2_500_000 == 0 ||
//            (digest.contains("999") && digest.contains("Q="))) {
//            logger.info("got [{}] count={}, base={}, invokedCount={}, digest={}.",
//                    item, newCount, counter.getBase(), invokedCount, digest);
//        }
    }

    @Override
    public void onError(Throwable ex) {
        logger.error("got an error.", ex);
    }

    @Override
    public void onComplete() {
        logger.error("when it is done: {}.", counter.get());
    }

}
