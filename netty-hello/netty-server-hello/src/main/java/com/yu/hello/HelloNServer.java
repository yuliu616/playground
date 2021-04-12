package com.yu.hello;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Lookup;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;

@Component
public class HelloNServer implements Runnable {

    private static Logger logger = LoggerFactory.getLogger(HelloNServer.class);

    @Value("${netty.port}")
    private int port;

    @Value("${netty.boss-thread-count}")
    private int bossThreadCount;

    @Value("${netty.worker-thread-count}")
    private int workerThreadCount;

    private EventLoopGroup activeGroups[];

    @Lookup
    protected MyNettyServerHandler myNettyServerHandler(){
        return null;
    }

    @Override
    public void run() {
        logger.info("start netty server at port=[{}].", port);

        // for server, you need a boss group to accept connections.
        EventLoopGroup bossGroup = new NioEventLoopGroup(bossThreadCount);
        EventLoopGroup workerGroup = new NioEventLoopGroup(workerThreadCount);
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup);
            // operated in socket level
            bootstrap.channel(NioServerSocketChannel.class);
            bootstrap.option(ChannelOption.SO_BACKLOG, 128);
            bootstrap.childOption(ChannelOption.SO_KEEPALIVE, true);

            bootstrap.childHandler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) throws Exception {
                    onChannelInit(ch);
                }
            });

            this.activeGroups = new EventLoopGroup[]{ bossGroup, workerGroup };
            // start server and close on end
            bootstrap.bind(port).addListener(new ChannelFutureListener() {
                @Override
                public void operationComplete(ChannelFuture channelFuture) throws Exception {
                    channelFuture.channel().closeFuture();
                }
            });

        } catch (Exception ex) {
            logger.error("error in Netty server loop.", ex);
        }
    }

    private void onChannelInit(SocketChannel ch) throws Exception {
        ch.pipeline().addLast(myNettyServerHandler());
    }

    @PreDestroy()
    private void preDestroy(){
        logger.info("shutdown netty groups ...");
        if (this.activeGroups != null) {
            for (int i=this.activeGroups.length-1;i>=0;i--) {
                this.activeGroups[i].shutdownGracefully();
            }
            this.activeGroups = null;
        }
        logger.info("shutdown netty groups ... done");
    }

}
