package com.yu.controller;

import com.yu.exception.InconsistencyDataException;
import com.yu.exception.RecordNotFoundException;
import com.yu.model.dto.CountDto;
import com.yu.model.Family;
import com.yu.model.Gender;
import com.yu.model.People;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("${hello-service.api-base-url}/people")
public class PeopleController {

    @Autowired
    private PeopleDataRepo peopleDataRepo;

    @Autowired
    private FamilyDataRepo familyDataRepo;

    private static final int PAGE_SIZE_MIN = 1;
    private static final int PAGE_SIZE_SAFE_LIMIT = 100;

    private static Logger logger = LoggerFactory.getLogger(PeopleController.class);

    @RequestMapping(method = RequestMethod.GET,
            path = "/dummyPerson",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People dummyPerson(){
        try {
            People p = new People();
            p.setId(10123);
            p.setFirstName("Peter");
            p.setLastName("Chan");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dob = LocalDate.parse("2000-10-23", formatter);
            dob = dob.minus(new Random().nextInt(50), ChronoUnit.YEARS);
            logger.info("dob = {}", formatter.format(dob));
            p.setDateOfBirth(dob);
            return p;
        } catch (DateTimeParseException ex) {
            logger.error("error parsing", ex);
            return null;
        }
    }

    @GetMapping("/{id}")
    public People findPeopleById(@PathVariable(name = "id") long id){
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        } else {
            return result.get();
        }
    }

    @GetMapping("")
    public List<People> listAllPeople(
            @RequestParam(value = "offset", defaultValue = "0") int offset,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "activeOnly", defaultValue = "true") boolean activeOnly
    ){
        int safePageSize = Math.max(Math.min(size, PAGE_SIZE_SAFE_LIMIT), PAGE_SIZE_MIN);
        int page = offset / safePageSize;
        List<People> list;
        if (activeOnly) {
            list = this.peopleDataRepo.findAllActive(PageRequest.of(page, safePageSize)).getContent();
        } else {
            list = this.peopleDataRepo.findAll(PageRequest.of(page, safePageSize)).getContent();
        }
        return list;
    }

    @GetMapping("/count")
    public CountDto countPeople(){
        long count = this.peopleDataRepo.count();
        return new CountDto(count);
    }

    @GetMapping("/{id}/husband")
    public People findHusbandById(
            @PathVariable("id") long id
    ){
        Optional<People> result = this.peopleDataRepo.findHusband(id);
        if (result.isPresent()) {
            return result.get();
        } else {
            throw new RecordNotFoundException();
        }
    }

    @GetMapping("/{id}/wife")
    public People findWifeById(
            @PathVariable("id") long id
    ){
        Optional<People> result = this.peopleDataRepo.findWife(id);
        if (result.isPresent()) {
            return result.get();
        } else {
            throw new RecordNotFoundException();
        }
    }


    @Transactional
    @PostMapping("")
    public People createPeopleAsProvided(
            @RequestBody @Valid People people)
    {
        people.setId(0);
        people.setVersion(1);
        People result = this.peopleDataRepo.save(people);
        logger.info("insertPeopleWithModel returned with people.id = {}", result.getId());
        Optional<People> reloaded = this.peopleDataRepo.findById(result.getId());
        return reloaded.get();
    }

    @Transactional
    @PutMapping("/{id}/updatePeopleWithNames")
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
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        }
        People target = result.get();
        if (target.getId() != id ||
            target.getVersion() != version) {
            throw new InconsistencyDataException();
        }
        target.setFirstName(firstName);
        target.setLastName(lastName);
        target.setNickname(nickname);
        this.peopleDataRepo.save(target);
        logger.info("updatePeopleWithNameById returned");
        return this.peopleDataRepo.findById(id).get();
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
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        }
        People target = result.get();
        if (target.getId() != id ||
            target.getVersion() != people.getVersion()) {
            throw new InconsistencyDataException();
        }

        target.setActive(people.isActive());
        target.setGender(people.getGender());
        target.setNickname(people.getNickname());
        target.setHeightInCm(people.getHeightInCm());
        target.setFirstName(people.getFirstName());
        target.setLastName(people.getLastName());
        target.setDateOfBirth(people.getDateOfBirth());
        target.setWeightInKg(people.getWeightInKg());

        this.peopleDataRepo.save(target);

        Optional<People> reloaded = this.peopleDataRepo.findById(target.getId());
        return reloaded.get();
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
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        }
        People beforeDelete = result.get();
        if (beforeDelete.getId() != id ||
            beforeDelete.getVersion() != version) {
            throw new InconsistencyDataException();
        }
        this.peopleDataRepo.deleteById(id);
        logger.info("deletePeopleWithId returned.");
        return beforeDelete;
    }

    @Transactional
    @PostMapping("/{id}/do/disable")
    public People disablePeopleAsProvided(
            @PathVariable("id") long id,
            @RequestBody Map<String, String> data
    ){
        String versionString = data.get("version");
        if (versionString == null) {
            throw new RuntimeException("version missing.");
        }
        int version = Integer.parseInt(versionString);
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        }
        People target = result.get();
        if (target.getId() != id ||
            target.getVersion() != version) {
            throw new InconsistencyDataException();
        }
        target.setActive(false);
        this.peopleDataRepo.save(target);
        logger.info("deletePeopleWithId returned.");

        Optional<People> reloaded = this.peopleDataRepo.findById(target.getId());
        return reloaded.get();
    }

    @Transactional
    @GetMapping("/{id}/asFather/family")
    public Family findFamilyOfFather(
            @PathVariable("id") long id
    ){
        Optional<Family> result = this.familyDataRepo.findByFatherId(id);
        if (result.isPresent()) {
            return result.get();
        } else {
            throw new RecordNotFoundException();
        }
    }

    @Transactional
    @PutMapping("/{id}/do/addAge")
    public People addAgeToPeopleById(@PathVariable(name = "id") long id,
                                     @RequestBody People people){
        if (id != people.getId()) {
            throw new RuntimeException("InconsistencyData");
        }
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        }
        People target = result.get();
        if (target.getId() != id ||
            target.getVersion() != people.getVersion()) {
            throw new InconsistencyDataException();
        }

        LocalDate dob = target.getDateOfBirth().minusYears(1);
        target.setDateOfBirth(dob);
        this.peopleDataRepo.save(target);

        Optional<People> reloaded = this.peopleDataRepo.findById(target.getId());
        return reloaded.get();
    }

    @GetMapping("/aFewPeople")
    public List<People> aFewPeople(){
        logger.info("aFewPeople !!!");
        List<People> list = this.peopleDataRepo.findFirst10ByGender(Gender.FEMALE);
        return list;
    }

}
