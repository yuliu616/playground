FROM openjdk:10-jdk

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

## Install app and dependencies
# RUN  mvn clean package

# Bundle app source
COPY target/spring-boot-hello-1.0.0.jar /usr/src/app/sprint-boot-hello.jar

EXPOSE 8080 
CMD java -jar /usr/src/app/sprint-boot-hello.jar

# build with this:
# > docker build -t spring-boot-hello .
