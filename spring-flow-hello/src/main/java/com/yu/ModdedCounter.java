package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

// this class is not thread-safe
@Component
public class ModdedCounter {

    protected long sum = 0;
    protected long base = 1000;
    protected long invokedCount = 0;

    private static Logger logger = LoggerFactory.getLogger(ModdedCounter.class);

    public void setBase(long base) {
        this.base = base*1000;
    }

    public long getBase() {
        return base;
    }

    public long addAndGet(long n){
//        logger.debug("addAndGet[{}]", n);

        this.sum = (this.sum + n) % base;
        this.invokedCount++;
        return this.sum;
    }

    public void set(long sum) {
        this.sum = sum;
    }

    public long get(){
        return this.sum;
    }

    public long getInvokedCount() {
        return invokedCount;
    }
}
