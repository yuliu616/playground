package com.yu.hello;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.Charset;

@Component
public class MyClientHandler extends ChannelInboundHandlerAdapter {

    @Value("${hello.make-http-request}")
    private boolean makeHttpRequest;

    @Value("${hello.make-http-request.path}")
    private String makeHttpRequestTargetPath;

    public static Logger logger = LoggerFactory.getLogger(MyClientHandler.class);

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        if (makeHttpRequest) {
            StringBuffer request = new StringBuffer();
            request.append("GET "+makeHttpRequestTargetPath+" HTTP/1.1\n");
            request.append("\n");
            byte[] data = request.toString().getBytes("UTF-8");

            ByteBuf buffer = ctx.alloc().buffer(data.length);
            buffer.writeBytes(data);
            ctx.writeAndFlush(buffer).sync();
        }
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // just print every input received from client
        ByteBuf msgBuffer = (ByteBuf)msg;
        int dataLen = msgBuffer.capacity();
        String bufferAsText = (String)msgBuffer
                .getCharSequence(0, dataLen, Charset.forName("UTF-8"));
        logger.info("got message from server (size={}): {}", dataLen, bufferAsText);
        ((ByteBuf)msg).release();
    }

}
