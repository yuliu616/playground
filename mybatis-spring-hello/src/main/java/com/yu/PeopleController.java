package com.yu;

import com.yu.exception.InconsistencyDataException;
import com.yu.exception.RecordNotFoundException;
import com.yu.model.Family;
import com.yu.model.Gender;
import com.yu.model.People;
import com.yu.model.CountDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/people")
@RestController
public class PeopleController {

    @Autowired
    private PeopleMapper peopleMapper;

    @Autowired
    private FamilyMapper familyMapper;

    private static final long PAGE_SIZE_MIN = 1;
    private static final long PAGE_SIZE_SAFE_LIMIT = 100;

    private static final Logger logger = LoggerFactory.getLogger(PeopleController.class);

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> throwable(Throwable throwable) {
        logger.error("Uncaught throwable", throwable);
        return Collections.singletonMap("message", throwable.getMessage());
    }

    @ExceptionHandler(RecordNotFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> failByRecordNotFound(RecordNotFoundException exception){
        return Collections.singletonMap("errorCode", "RECORD_NOT_FOUND");
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> mvcValidationFailure(Throwable exception) {
        logger.error("mvcValidationFailure", exception);
        return Collections.singletonMap("errorCode", "VALIDATION_ERROR");
    }

    @ExceptionHandler(InconsistencyDataException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> failByDataInconsistency(InconsistencyDataException exception){
        return Collections.singletonMap("errorCode", "DATA_INCONSISTENCY");
    }

    @GetMapping("/{id}")
    public People findPeopleById(
            @PathVariable("id") long id
    ){
        People p = peopleMapper.findPeopleById(id);
        if (p != null) {
            logger.info("loaded people: {} {} {}", p.getId(), p.getFirstName(), p.getLastName());
        } else {
            logger.info("people not found for id {}", id);
            throw new RecordNotFoundException();
        }
        return p;
    }

    @GetMapping("")
    public List<People> listAllPeople(
            @RequestParam(value = "offset", defaultValue = "0") long offset,
            @RequestParam(value = "size", defaultValue = "10") long size,
            @RequestParam(value = "activeOnly", defaultValue = "true") boolean activeOnly
    ){
        long safePageSize = Math.max(Math.min(size, PAGE_SIZE_SAFE_LIMIT), PAGE_SIZE_MIN);
        List<People> list;
        if (activeOnly) {
            list = this.peopleMapper.listAllPeople(true, offset, safePageSize);
        } else {
            list = this.peopleMapper.listAllPeople2(offset, safePageSize);
        }
        return list;
    }

    @GetMapping("/count")
    public CountDto countPeople(){
        long count = this.peopleMapper.countAll();
        return new CountDto(count);
    }

    @GetMapping("/{id}/husband")
    public People findHusbandById(
            @PathVariable("id") long id
    ){
        People p = peopleMapper.findHusbandByWifeId(id);
        if (p == null) {
            throw new RecordNotFoundException();
        }
        return p;
    }

    @GetMapping("/{id}/wife")
    public People findWifeById(
            @PathVariable("id") long id
    ){
        People p = peopleMapper.findWifeByHusbandId(id);
        if (p == null) {
            throw new RecordNotFoundException();
        }
        return p;
    }

    @Transactional
    @PostMapping("/createByNamesAndGender")
    public People createPeopleWithNamesAndGender(
            @RequestBody Map<String, String> data
    ){
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

    @Transactional
    @PostMapping("")
    public People createPeopleAsProvided(
            @RequestBody @Valid People people
    ){
        this.peopleMapper.insertPeopleWithModel(people);
        logger.info("insertPeopleWithModel returned with people.id = {}", people.getId());
        people = this.peopleMapper.findPeopleById(people.getId());
        return people;
    }

    @Transactional
    @PutMapping("/{id}/updatePeopleWithNames")
    public People updatePeopleWithNames(
            @PathVariable("id") long id,
            @RequestBody Map<String, String> data
    ){
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

    @Transactional
    @PutMapping("/{id}")
    public People updatePeopleAsProvided(
            @PathVariable("id") long id,
            @RequestBody @Valid People people
    ){
        if (id != people.getId()) {
            throw new RuntimeException("InconsistencyData");
        }
        long recordAffected = this.peopleMapper.updatePeopleWithModel(people);
        if (recordAffected == 0) {
            throw new RuntimeException("update failed to affect any record.");
        }
        people = this.peopleMapper.findPeopleById(people.getId());
        return people;
    }

    @Transactional
    @DeleteMapping("/{id}")
    public People deletePeopleAsProvided(
            @PathVariable("id") long id,
            @RequestBody Map<String, String> data
    ){
        String versionString = data.get("version");
        if (versionString == null) {
            throw new RuntimeException("version missing.");
        }
        int version = Integer.parseInt(versionString);
        People beforeDelete = this.peopleMapper.findPeopleById(id);
        long recordAffected = this.peopleMapper.deletePeopleWithId(
                id, version);
        logger.info("deletePeopleWithId returned: {}", recordAffected);
        if (recordAffected == 0) {
            throw new RuntimeException("delete failed to affect any record.");
        }
        return beforeDelete;
    }

    @Transactional
    @PostMapping("/{id}/disable")
    public People disablePeopleAsProvided(
            @PathVariable("id") long id,
            @RequestBody Map<String, String> data
    ){
        String versionString = data.get("version");
        if (versionString == null) {
            throw new RuntimeException("version missing.");
        }
        int version = Integer.parseInt(versionString);
        long recordAffected = this.peopleMapper.disablePeopleWithId(
                id, version);
        logger.info("disablePeopleWithId returned: {}", recordAffected);
        if (recordAffected == 0) {
            throw new RuntimeException("disable failed to affect any record.");
        }
        People updated = this.peopleMapper.findPeopleById(id);
        return updated;
    }

    @Transactional
    @GetMapping("/{id}/asFather/family")
    public Family findFamilyOfFather(
            @PathVariable("id") long id
    ){
        Family family = this.familyMapper.findFamilyByFatherId(id);
        return family;
    }

}
