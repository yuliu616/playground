package com.yu.hello;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.StringReader;
import java.nio.charset.Charset;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// netty server handler is not sharable (normally)
// therefore, we define it as a 'prototype' scoped bean
@Component
@Scope(value = "prototype")
public class MyNettyServerHandler extends ChannelInboundHandlerAdapter {

    @Value("${hello.will-send-greeting-message}")
    private boolean willSendGreetingMessage;

    @Value("${hello.response-as-echo}")
    private boolean responseAsEcho;

    @Value("${hello.response-as-http-works}")
    private boolean responseAsHttpWorks;

    @Value("${hello.response-as-http-works.work-repeating-count}")
    private int workRepeatingCount;

    @Value("${hello.response-as-http-works.burst-data}")
    private boolean responseAsHttpWorksInBurstDataMode;

    @Value("${hello.response-as-http-echo}")
    private boolean responseAsHttpEcho;

    private static Logger logger = LoggerFactory.getLogger(MyNettyServerHandler.class);

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        // on connected
        logger.info("someone is now active");
        if (this.willSendGreetingMessage) {
            String time = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
            byte[] data = ("{ msg: \"i am netty\", time: \""+time+"\"}")
                    .getBytes("UTF-8");
            ByteBuf buffer = ctx.alloc().buffer(data.length);
            buffer.writeBytes(data);
            ctx.writeAndFlush(buffer).addListener(new ChannelFutureListener() {
                @Override
                public void operationComplete(ChannelFuture future) throws Exception {
                    ctx.close();
                }
            });
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        // on disconnected
        logger.info("someone is now inactive");
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (this.responseAsEcho) {
            this.echoWhateverReceived(ctx, msg);
        } else if (this.responseAsHttpWorks) {
            this.writeHttpWorksResp(ctx, msg, workRepeatingCount);
        } else if (this.responseAsHttpEcho) {
            this.echoAsHttp(ctx, msg);
        } else {
            this.ignoreWhateverReceived(ctx, msg);
        }
    }

    private void ignoreWhateverReceived(ChannelHandlerContext ctx, Object msg) throws Exception {
        // just receive all data and do nothing.
        ((ByteBuf)msg).release();
    }

    private void echoWhateverReceived(ChannelHandlerContext ctx, Object msg) throws Exception {
        // send back whatever received from client
        ByteBuf msgBuffer = (ByteBuf)msg;
        int dataLen = msgBuffer.capacity();
        String bufferAsText = (String)msgBuffer
                .getCharSequence(0, dataLen, Charset.forName("UTF-8"));
        logger.info("got message from client (size={}): {}", dataLen, bufferAsText);
        ((ByteBuf)msg).release();

        byte[] echoText = (bufferAsText).getBytes("UTF-8");
        ByteBuf echoBuffer = ctx.alloc().buffer(echoText.length);
        echoBuffer.writeBytes(echoText);
        ctx.writeAndFlush(echoBuffer).addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                ctx.close();
            }
        });
    }

    /**
     * served as a HTTP server, accepted query string params:
     * - word = b/n/w
     * - repeatCount = (int) word count of response
     */
    private void writeHttpWorksResp(ChannelHandlerContext ctx, Object msg, int itWorksRepeatingCount) throws Exception {
        ByteBuf msgBuffer = (ByteBuf)msg;
        int dataLen = msgBuffer.capacity();
        String bufferAsText = (String)msgBuffer
                .getCharSequence(0, dataLen, Charset.forName("UTF-8"));
        ((ByteBuf)msg).release();

        // traverse all http headers in input
        String httpMethod = null;
        Map<String, String> httpHeaders = new HashMap<>();
        String targetPath = null;

        try (BufferedReader input = new BufferedReader(new StringReader(bufferAsText))){
            String line;
            while ((line = input.readLine()) != null){
                logger.info("> "+line);
                if (httpMethod == null &&
                        line.matches("^([A-Z]+) (.*) (HTTP/1.1)$")) {
                    // pattern: GET /works HTTP/1.1
                    int firstSpace = line.indexOf(' ');
                    int secSpace = line.indexOf(' ', firstSpace+1);
                    httpMethod = line.substring(0, firstSpace);
                    targetPath = line.substring(firstSpace+1, secSpace);
                    continue;
                }

                int colonAt = line.indexOf(": ");
                if (colonAt >= 0) {
                    String key = line.substring(0, colonAt);
                    String value = line.substring(colonAt+": ".length());
                    httpHeaders.put(key, value);
                }
            }
        }

        logger.info("client making HTTP request with method=[{}], path: {}",
                httpMethod, targetPath);

        // compose response data
        String itWorkSymbol = "it works!!";
        int qsStartedAt = targetPath.indexOf('?');
        if (qsStartedAt >= 0) {
            String queryString = "&"+targetPath.substring(qsStartedAt+1)+"&";
            if (queryString.contains("&word=w")) {
                itWorkSymbol = "Working!!!";
            } else if (queryString.contains("&word=b")) {
                itWorkSymbol = "Beautiful!";
            } else if (queryString.contains("&word=n")) {
                itWorkSymbol = "Nice job!!";
            }
            if (queryString.contains("&repeatCount=")) {
                int paramAt = queryString.indexOf("&repeatCount=");
                int paramEndAt = queryString.indexOf("&", paramAt+1);
                String countStr = queryString.substring(
                        paramAt+"&repeatCount=".length(), paramEndAt);
                itWorksRepeatingCount = Integer.parseInt(countStr);
            }
        }

        StringBuilder responseHeaderPart = new StringBuilder();
        responseHeaderPart.append("HTTP/1.1 200 OK\n");
        responseHeaderPart.append("Content-Length: "+(itWorkSymbol.length() * itWorksRepeatingCount)+"\n");
        responseHeaderPart.append("\n"); // http/1.1 use a blank line as end of http headers

        { //write response header
            logger.info("write response header ...");
            ByteBuf respBuffer = ctx.alloc().buffer(responseHeaderPart.length());
            respBuffer.writeBytes(responseHeaderPart.toString().getBytes("UTF-8"));
            ctx.writeAndFlush(respBuffer).sync();
            logger.info("write response header ... done");
        }
        { //write response content
            for (int i=0;i<itWorksRepeatingCount;i++) {
                logger.info("write response content ... i={}", i);
                byte[] itWorkSymbolBytes = itWorkSymbol.getBytes("UTF-8");
                ByteBuf respBuffer = ctx.alloc().buffer(itWorkSymbolBytes.length);
                respBuffer.writeBytes(itWorkSymbolBytes);
                ctx.writeAndFlush(respBuffer).sync();
                if (i > 0 && i % 10 == 0 &&
                    !this.responseAsHttpWorksInBurstDataMode)
                {
                    Thread.sleep((long)(1000*Math.random()));
                }
            }
            logger.info("write response content ... done");
        }
        ctx.close();
    }

    private void echoAsHttp(ChannelHandlerContext ctx, Object msg) throws Exception {
        ByteBuf msgBuffer = (ByteBuf)msg;
        int dataLen = msgBuffer.capacity();
        String bufferAsText = (String)msgBuffer
                .getCharSequence(0, dataLen, Charset.forName("UTF-8"));
        ((ByteBuf)msg).release();

        // grep (locate) Content Length header in input
        Matcher matchedContentLen = Pattern.compile(
                "^Content-Length: [0-9]+$", Pattern.MULTILINE)
                .matcher(bufferAsText);
        String requestBody = null;
        int reqContentLength;
        if (matchedContentLen.find()) {
//            logger.info("matchedContentLen found at: {}-{} as [{}]",
//                matchedContentLen.start(), matchedContentLen.end(),
//                matchedContentLen.group());
            reqContentLength = Integer.parseInt(
                    matchedContentLen.group().substring("Content-Length: ".length())
            );
        } else {
            // just assume content-length is zero if not provided.
            reqContentLength = 0;
        }

        // follows request 'Content-Length' to trim input data
        Matcher doubleNewLineMatches = Pattern.compile("[\r]?\n[\r]?\n", Pattern.MULTILINE)
                .matcher(bufferAsText);
        if (doubleNewLineMatches.find()) {
            requestBody = bufferAsText.substring(doubleNewLineMatches.end(),
                    doubleNewLineMatches.end() + reqContentLength);
            logger.info("Request Content/Body (size={}): [{}]", reqContentLength, requestBody);
            bufferAsText = bufferAsText.substring(0, doubleNewLineMatches.end() + reqContentLength);
            logger.info("got message from client (size={})(trimmed size={}): {}",
                    dataLen, bufferAsText.length(), bufferAsText);
        }

        // traverse all http headers in input
        String httpMethod = null;
        Map<String, String> httpHeaders = new HashMap<>();
        String targetPath = null;
        String host = null;
        String accept = null;

        try (BufferedReader input = new BufferedReader(new StringReader(bufferAsText))){
            String line;
            while ((line = input.readLine()) != null){
                logger.info("> "+line);
                if (httpMethod == null &&
                line.matches("^([A-Z]+) (.*) (HTTP/1.1)$")) {
                    // pattern: GET /works HTTP/1.1
                    int firstSpace = line.indexOf(' ');
                    int secSpace = line.indexOf(' ', firstSpace+1);
                    httpMethod = line.substring(0, firstSpace);
                    targetPath = line.substring(firstSpace+1, secSpace);
                    continue;
                }

                int colonAt = line.indexOf(": ");
                if (colonAt >= 0) {
                    String key = line.substring(0, colonAt);
                    String value = line.substring(colonAt+": ".length());
                    httpHeaders.put(key, value);
                    if (key.equals("Host")) {
                        host = value;
                    } else if (key.equals("Accept")) {
                        accept = value;
                    }
                }
            }
        }

        logger.info("client making HTTP request with method=[{}], path: {}",
                httpMethod, targetPath);
        logger.info("client host: {} accept: {}",
                host, accept);

        // compose response data
        StringBuilder responseContentPart = new StringBuilder();
        if (accept.equals("application/json")) {
            // response as json
            Map dto = new HashMap();
            dto.put("serverTime", DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant()));
            dto.put("method", httpMethod);
            dto.put("path", targetPath);
            dto.put("headers", httpHeaders);
            dto.put("body", requestBody);
            dto.put("raw", bufferAsText);
            String json = com.alibaba.fastjson.JSONObject.toJSONString(dto);
            responseContentPart.append(json);
        } else { // response as html
            responseContentPart.append("<html>\n");
            responseContentPart.append("<body>\n");
            responseContentPart.append("<pre>\n");
            responseContentPart.append(bufferAsText);
            responseContentPart.append("</pre>\n");
            responseContentPart.append("</body>\n");
            responseContentPart.append("</html>\n");
        }

        StringBuilder responseHeaderPart = new StringBuilder();
        responseHeaderPart.append("HTTP/1.1 200 OK\n");
        responseHeaderPart.append("X-Powered-By: MyNetty\n");
        if (accept.equals("application/json")) {
            responseHeaderPart.append("Content-Type: application/json\n");
        } else {
            responseHeaderPart.append("Content-Type: text/html\n");
        }
        responseHeaderPart.append("Content-Length: "+responseContentPart.length()+"\n");
        responseHeaderPart.append("\n"); // http/1.1 use a blank line as end of http headers

        { //write response header
            logger.info("write response header ...");
            ByteBuf respBuffer = ctx.alloc().buffer(responseHeaderPart.length());
            respBuffer.writeBytes(responseHeaderPart.toString().getBytes("UTF-8"));
            ctx.writeAndFlush(respBuffer).sync();
            logger.info("write response header ... done");
        }
        { //write response content
            logger.info("write response content ...");
            ByteBuf respBuffer = ctx.alloc().buffer(responseContentPart.length());
            respBuffer.writeBytes(responseContentPart.toString().getBytes("UTF-8"));
            ctx.writeAndFlush(respBuffer).sync();
            logger.info("write response content ... done");
        }
        ctx.close();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        logger.error("channel exception caught", cause);
    }

}
