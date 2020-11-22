package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

// this class is not thread-safe
@Component
public class CharArrayCounter {

    private char[] buffer = new char[100];
    private long invokedCount = 0;

    private static Logger logger = LoggerFactory.getLogger(CharArrayCounter.class);

    public CharArrayCounter(){
        for (int i=0;i<buffer.length;i++) {
            buffer[i] = '/';
        }
    }

    public void add(String data, int index){
//        logger.debug("add[{}] index=[{}]", data, index);

        String digest = DigestUtil.digestString(data);
//        String digest = "9";
        int ascii = (int)buffer[index];
        int newAscii = ascii + (int)digest.charAt(0);
        if (newAscii > 127) {
            newAscii = newAscii % 80 + (int)'/';
        }
        buffer[index] = (char)newAscii;
        invokedCount++;
    }

    public String get() {
        return new String(buffer);
    }

    public long getInvokedCount() {
        return invokedCount;
    }
}
