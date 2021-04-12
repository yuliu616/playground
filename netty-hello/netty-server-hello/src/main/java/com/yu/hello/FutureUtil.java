package com.yu.hello;

import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import java.util.concurrent.CompletableFuture;

public class FutureUtil {

    public static <V> CompletableFuture<V> asCompleteFuture(ChannelFuture future){
        CompletableFuture<V> converted = new CompletableFuture<>();
        future.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture channelFuture) throws Exception {
                converted.complete(null);
            }
        });
        return converted;
    }

}
