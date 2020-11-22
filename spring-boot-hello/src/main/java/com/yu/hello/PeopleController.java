package com.yu.hello;

import com.yu.exception.InconsistencyDataException;
import com.yu.exception.RecordNotFoundException;
import com.yu.model.CountDto;
import com.yu.model.Family;
import com.yu.model.Gender;
import com.yu.model.People;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("${apiMeta.path}")
public class PeopleController {

    @Autowired
    private PeopleDataRepo peopleDataRepo;

    @Autowired
    private FamilyDataRepo familyDataRepo;

//    @Autowired
//    private EntityManagerFactory entityManagerFactory;

    private static Logger logger = LoggerFactory.getLogger(PeopleController.class);

    @ExceptionHandler(RecordNotFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> failByRecordNotFound(RecordNotFoundException exception){
        return Collections.singletonMap("errorCode", "RECORD_NOT_FOUND");
    }

    @ExceptionHandler(InconsistencyDataException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> failByRecordNotFound(InconsistencyDataException exception){
        return Collections.singletonMap("errorCode", "DATA_INCONSISTENCY");
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public List<People> listPeople(@RequestParam(value = "offset", defaultValue = "0") int offset,
                                   @RequestParam(value = "limit", defaultValue = "10") int limit){
        if (limit > 100) {
            limit = 100;
        }
        int page = offset / limit;
        logger.info("listPeople !!! page={} limit={}", page, limit);
        List<People> list = this.peopleDataRepo.findAll(PageRequest.of(page, limit)).getContent();
        return list;
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People/count",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public CountDto countPeople(){
        long count = this.peopleDataRepo.count();
        return new CountDto(count);
    }

    @Transactional
    @RequestMapping(method = RequestMethod.POST,
            path = "/People",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People createPeople(@RequestBody People people){
        logger.info("createPeople !!!");
        people.setId(0);
        people.setVersion(1);
        People result = this.peopleDataRepo.save(people);
        return result;
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People findPeopleById(@PathVariable(name = "id") int id){
        logger.info("findPeopleById !!!");
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        } else {
            return result.get();
        }
    }

    @Transactional
    @RequestMapping(method = RequestMethod.PUT,
            path = "/People/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public People updatePeople(@PathVariable(name = "id") int id,
                               @RequestBody People targetPeople){
        logger.info("updatePeople !!!");
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        }
        People target = result.get();
        if (target.getId() != id ||
                target.getVersion() != targetPeople.getVersion()) {
            throw new InconsistencyDataException();
        }

        target.setFirstName(targetPeople.getFirstName());
        target.setLastName(targetPeople.getLastName());
        target.setDateOfBirth(targetPeople.getDateOfBirth());
        target.setWeightInKg(targetPeople.getWeightInKg());

        this.peopleDataRepo.save(target);

        Optional<People> reloaded = this.peopleDataRepo.findById(target.getId());
        return reloaded.get();
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People/{id}/wife",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Optional<People> findWife(@PathVariable(name = "id") int id){
        logger.info("findWife id={}.", id);
        return this.peopleDataRepo.findWife(id);
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People/{id}/husband",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Optional<People> findHusband(@PathVariable(name = "id") int id){
        logger.info("findHusband id={}.", id);
        return this.peopleDataRepo.findHusband(id);
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People/{id}/asFather/family",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Optional<Family> findFamilyOfFather(@PathVariable(name = "id") int id){
        logger.info("findFamilyOfFather id={}.", id);
        return this.familyDataRepo.findByFatherId(id);
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/Family/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Optional<Family> findFamilyOfId(@PathVariable(name = "id") int id){
        logger.info("findFamilyOfId id={}.", id);
        return this.familyDataRepo.findById(id);
    }

    @Transactional
    @RequestMapping(method = RequestMethod.PUT,
            path = "/People/{id}/addAge",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public People addAgeToPeopleById(@PathVariable(name = "id") int id,
                                     @RequestBody People targetPeople){
        logger.info("addAge !!!");
        Optional<People> result = this.peopleDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        }
        People target = result.get();
        if (target.getId() != id ||
                target.getVersion() != targetPeople.getVersion()) {
            throw new InconsistencyDataException();
        }

        LocalDate dob = target.getDateOfBirth().minusYears(1);
        target.setDateOfBirth(dob);
        this.peopleDataRepo.save(target);

        Optional<People> reloaded = this.peopleDataRepo.findById(target.getId());
        return reloaded.get();
    }

    // no need to clone object.
    @RequestMapping(method = RequestMethod.GET,
            path = "/People/firstMan",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public People firstMan(){
        logger.info("firstMan, entity class as dao !!!");
        Optional<People> result = this.peopleDataRepo.findById(10);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        } else {
            return result.get();
        }
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People/aMan",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Map aManDto(){
        logger.info("man dao !!!");
        HashMap<String, Object> dto = new HashMap<>();

        Optional<People> result = this.peopleDataRepo.findById(10);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        }

        People first = result.get();
        dto.put("id", first.getId());
        dto.put("gender", first.getGender());
        dto.put("age", LocalDate.now().getYear() - first.getDateOfBirth().getYear());
        return dto;
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People/justAnotherWomen",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Optional<People> justAnotherWomen(){
        logger.info("justAnotherWomen !!!");
        Optional<People> ppl = this.peopleDataRepo.findFirstByGender(Gender.FEMALE);
        return ppl;
    }

    @RequestMapping(method = RequestMethod.GET,
            path = "/People/aFewPeople",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public List<People> aFewPeople(){
        logger.info("aFewPeople !!!");
        List<People> list = this.peopleDataRepo.findFirst10ByGender(Gender.FEMALE);
        return list;
    }

}
