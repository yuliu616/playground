package com.yu.hello;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;

@Component
public class HelloNClient implements Runnable {

    @Value("${nettyServer.host}")
    private String serverHost;

    @Value("${nettyServer.port}")
    private int serverPort;

    @Autowired
    protected MyClientHandler myClientHandler;

    private EventLoopGroup workerGroup;

    public static Logger logger = LoggerFactory.getLogger(HelloNClient.class);

    @Override
    public void run() {
        workerGroup = new NioEventLoopGroup();
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(workerGroup);
            bootstrap.channel(NioSocketChannel.class);
            bootstrap.option(ChannelOption.SO_KEEPALIVE, true);
            bootstrap.handler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) throws Exception {
                    ch.pipeline().addLast(myClientHandler);
                }
            });

            // start client and close on end
            ChannelFuture f = bootstrap.connect(serverHost, serverPort).sync();
            f.channel().closeFuture().sync();
        } catch (Exception ex) {
            logger.error("error in Netty client loop.", ex);
        }
    }

    @PreDestroy
    private void preDestory(){
        logger.info("shutdown netty groups ...");
        workerGroup.shutdownGracefully();
        logger.info("shutdown netty groups ... done");
    }

}
