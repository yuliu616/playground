package com.yu;

import com.yu.model.Gender;
import com.yu.model.People;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RequestMapping("/hello")
@RestController
public class Hello {

    @Autowired
    private PeopleMapper peopleMapper;

    private static final Logger logger = LoggerFactory.getLogger(Hello.class);

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> throwable(Throwable throwable) {
        logger.error("Uncaught throwable", throwable);
        return Collections.singletonMap("message", throwable.getMessage());
    }

    @RequestMapping(
            method = RequestMethod.GET,
            value = "/people/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People findPeopleById(
            @PathVariable("id") long id
    ){
        People p = peopleMapper.findPeopleById(id);
        if (p != null) {
            logger.info("loaded people: {} {} {}", p.getId(), p.getFirstName(), p.getLastName());
        } else {
            logger.info("people not found for id {}", id);
        }
        return p;
    }

    @RequestMapping(
            method = RequestMethod.POST,
            value = "/people/createByNamesAndGender",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People createPeopleWithNamesAndGender(
            @RequestBody Map<String, String> data)
    {
        String firstName = data.get("firstName");
        String lastName = data.get("lastName");
        String nickname = data.get("nickname");
        String genderString = data.get("gender");
        if (StringUtils.isEmpty(firstName)){
            throw new RuntimeException("firstName missing.");
        }
        if (StringUtils.isEmpty(lastName)){
            throw new RuntimeException("lastName missing.");
        }
        if (genderString == null) {
            throw new RuntimeException("gender missing.");
        }
        Gender gender = Enum.valueOf(Gender.class, genderString);
        long recordAffected = this.peopleMapper.insertPeopleWithNamesAndGender(
                firstName, lastName, nickname, gender);
        logger.info("insertPeopleWithNamesAndGender returned: {}", recordAffected);
        return this.peopleMapper.findLastInsertedPeople();
    }

    @RequestMapping(
            method = RequestMethod.POST,
            value = "/people",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People createPeopleAsProvided(
            @RequestBody People people)
    {
        if (StringUtils.isEmpty(people.getFirstName())){
            throw new RuntimeException("firstName missing.");
        }
        if (StringUtils.isEmpty(people.getLastName())){
            throw new RuntimeException("lastName missing.");
        }
        this.peopleMapper.insertPeopleWithModel(people);
        logger.info("insertPeopleWithModel returned with people.id = {}", people.getId());
        people = this.peopleMapper.findPeopleById(people.getId());
        return people;
    }

    @RequestMapping(
            method = RequestMethod.PUT,
            value = "/people/{id}/updatePeopleWithNames",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People updatePeopleWithNames(
            @PathVariable("id") long id,
            @RequestBody Map<String, String> data)
    {
        String firstName = data.get("firstName");
        String lastName = data.get("lastName");
        String nickname = data.get("nickname");
        String versionString = data.get("version");
        if (StringUtils.isEmpty(firstName)){
            throw new RuntimeException("firstName missing.");
        }
        if (StringUtils.isEmpty(lastName)){
            throw new RuntimeException("lastName missing.");
        }
        if (versionString == null) {
            throw new RuntimeException("version missing.");
        }
        int version = Integer.parseInt(versionString);
        long recordAffected = this.peopleMapper.updatePeopleWithNameById(
                id, version,
                firstName, lastName, nickname);
        logger.info("updatePeopleWithNameById returned: {}", recordAffected);
        if (recordAffected == 0) {
            throw new RuntimeException("update failed to affect any record.");
        }
        return this.peopleMapper.findPeopleById(id);
    }

    @RequestMapping(
            method = RequestMethod.PUT,
            value = "/people/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People updatePeopleAsProvided(
            @PathVariable("id") long id,
            @RequestBody People people)
    {
        if (StringUtils.isEmpty(people.getFirstName())){
            throw new RuntimeException("firstName missing.");
        }
        if (StringUtils.isEmpty(people.getLastName())){
            throw new RuntimeException("lastName missing.");
        }
        long recordAffected = this.peopleMapper.updatePeopleWithModel(people);
        if (recordAffected == 0) {
            throw new RuntimeException("update failed to affect any record.");
        }
        people = this.peopleMapper.findPeopleById(people.getId());
        return people;
    }

    @RequestMapping(
            method = RequestMethod.DELETE,
            value = "/people/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String deletePeopleAsProvided(
            @PathVariable("id") long id,
            @RequestBody Map<String, String> data)
    {
        String versionString = data.get("version");
        if (versionString == null) {
            throw new RuntimeException("version missing.");
        }
        int version = Integer.parseInt(versionString);
        long recordAffected = this.peopleMapper.deletePeopleWithId(
                id, version);
        logger.info("deletePeopleWithId returned: {}", recordAffected);
        if (recordAffected == 0) {
            throw new RuntimeException("delete failed to affect any record.");
        }
        return "deletion done";
    }

}
