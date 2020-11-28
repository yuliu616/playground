package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@RequestMapping("hello")
@RestController
public class HelloRedisController {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static Logger logger = LoggerFactory.getLogger(HelloRedisController.class);

    @RequestMapping("string-get")
    public String stringGet() {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        redisTemplate.opsForValue().set("sometime", nowStr);
        return redisTemplate.opsForValue().get("first_hero");
    }

    @RequestMapping(value = "string-set", method = RequestMethod.POST)
    public void stringSet(
            @RequestParam("name") String name)
    {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        redisTemplate.opsForValue().set("first_hero", name);
        redisTemplate.opsForValue().set("sometime", nowStr);
    }

    @RequestMapping(value = "hash-set", method = RequestMethod.POST)
    public void hashSet(
            @RequestParam("ppl") String ppl,
            @RequestParam("name") String name,
            @RequestParam("age") int age)
    {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        redisTemplate.opsForHash().put(ppl, "first_name", name);
        redisTemplate.opsForHash().put(ppl, "age", String.valueOf(age));
        redisTemplate.opsForValue().set("sometime", nowStr);
    }

    @RequestMapping("hash-get")
    public String hashGet(
            @RequestParam("ppl") String ppl
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        String firstName = (String)redisTemplate.opsForHash().get(ppl, "first_name");
        String age = (String)redisTemplate.opsForHash().get(ppl, "age");
        logger.info("person[{}] = {} {}", ppl, firstName, age);
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "person["+ppl+"] = "+firstName+", age ="+age;
    }

    @RequestMapping("list-get-first")
    public String listGetFirst(
            @RequestParam("family") String family
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        Long familySize = redisTemplate.opsForList().size(family);
        List<String> peopleList = redisTemplate.opsForList().range(family, 0, 0);
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "family size ="+familySize+" people(first): {"+String.join(",",peopleList)+"}";
    }

    @RequestMapping("list-get")
    public String listGetAll(
            @RequestParam("family") String family
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        Long familySize = redisTemplate.opsForList().size(family);
        List<String> peopleList = redisTemplate.opsForList().range(family, 0, familySize);
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "family size = "+familySize+" people: {"+String.join(",",peopleList)+"}";
    }

    @RequestMapping(value = "list-add", method = RequestMethod.POST)
    public String listAdd(
            @RequestParam("family") String family,
            @RequestParam("name") String name
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        Long familySize = redisTemplate.opsForList().size(family);
        redisTemplate.opsForList().rightPush(family, name);
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "family size(before) = "+familySize+"";
    }

    @RequestMapping(value = "list-insert", method = RequestMethod.POST)
    public String listInsert(
            @RequestParam("family") String family,
            @RequestParam("name") String name
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        Long familySize = redisTemplate.opsForList().size(family);
        redisTemplate.opsForList().leftPush(family, name);
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "family size(before) = "+familySize+"";
    }

    @RequestMapping(value = "list-remove", method = RequestMethod.POST)
    public String listRemove(
            @RequestParam("family") String family,
            @RequestParam("name") String name
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        Long familySize = redisTemplate.opsForList().size(family);
        redisTemplate.opsForList().remove(family, 1, name); // remove x1 only
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "family size(before) = "+familySize+"";
    }

    @RequestMapping("set-exists")
    public String isSetContains(
            @RequestParam("family") String family,
            @RequestParam("name") String name
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        Long familySize = redisTemplate.opsForSet().size(family);
        boolean found = redisTemplate.opsForSet().isMember(family, name);
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "family size = "+familySize+" "+name+": {"+(found?"Y":"N")+"}";
    }

    @RequestMapping(value = "set-add", method = RequestMethod.POST)
    public String setAdd(
            @RequestParam("family") String family,
            @RequestParam("name") String name
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        Long familySize = redisTemplate.opsForSet().size(family);
        redisTemplate.opsForSet().add(family, name);
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "family size(before) = "+familySize+"";
    }

    @RequestMapping(value = "set-remove", method = RequestMethod.POST)
    public String setRemove(
            @RequestParam("family") String family,
            @RequestParam("name") String name
    ) {
        String nowStr = DateTimeFormatter.ISO_INSTANT.format(new Date().toInstant());
        logger.info("last sometime = {}", redisTemplate.opsForValue().get("sometime"));
        Long familySize = redisTemplate.opsForSet().size(family);
        redisTemplate.opsForSet().remove(family, name);
        redisTemplate.opsForValue().set("sometime", nowStr);
        return "family size(before) = "+familySize+"";
    }

}
