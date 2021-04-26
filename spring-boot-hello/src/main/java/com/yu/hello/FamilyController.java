package com.yu.hello;

import com.yu.exception.InconsistencyDataException;
import com.yu.exception.RecordNotFoundException;
import com.yu.model.Family;
import com.yu.model.People;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${hello.api-base-url}/family")
public class FamilyController {

    @Autowired
    private FamilyDataRepo familyDataRepo;

    @Autowired
    private PeopleDataRepo peopleDataRepo;

    private static final int PAGE_SIZE_MIN = 1;
    private static final int PAGE_SIZE_SAFE_LIMIT = 100;

    private static Logger logger = LoggerFactory.getLogger(FamilyController.class);

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
    public Map<String, String> mvcValidationFailure(Throwable throwable) {
        logger.error("mvcValidationFailure", throwable);
        return Collections.singletonMap("errorCode", "VALIDATION_ERROR");
    }

    @ExceptionHandler(InconsistencyDataException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> failByDataInconsistency(InconsistencyDataException exception){
        return Collections.singletonMap("errorCode", "DATA_INCONSISTENCY");
    }

    @GetMapping("/{id}")
    public Family findFamilyById(
            @PathVariable("id") long id,
            @RequestParam(name="includeChildren", defaultValue = "false") boolean includeChildren
    ){
        Optional<Family> result = this.familyDataRepo.findById(id);

        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        } else {
            Family family = result.get();
            if (!includeChildren) {
                family.setChildren(null);
            }
            return family;
        }
    }

    @GetMapping("")
    public List<Family> listAllFamily(
            @RequestParam(value = "offset", defaultValue = "0") int offset,
            @RequestParam(value = "size", defaultValue = "10") int size
    ){
        int safePageSize = Math.max(Math.min(size, PAGE_SIZE_SAFE_LIMIT), PAGE_SIZE_MIN);
        int page = offset / safePageSize;
        List<Family> list = this.familyDataRepo.findAll(PageRequest.of(page, safePageSize)).getContent();
        // wont include children in the response
        for (Family family: list) {
            family.setChildren(null);
        }
        return list;
    }

    @GetMapping("/{id}/children")
    public List<People> findFamilyChildrenById(
            @PathVariable("id") long id
    ){
        Optional<Family> result = this.familyDataRepo.findById(id);
        if (!result.isPresent()) {
            throw new RecordNotFoundException();
        } else {
            return result.get().getChildren();
        }
    }

    @Transactional
    @PostMapping("")
    public Family createFamily(
            @Valid @RequestBody() Family family
    ){
        Optional<People> fatherExist = this.peopleDataRepo.findById(family.getFather().getId());
        Optional<People> motherExist = this.peopleDataRepo.findById(family.getMother().getId());
        if (!fatherExist.isPresent()) {
            throw new RuntimeException("failed to locate father with id: "+family.getFather().getId());
        }
        if (!motherExist.isPresent()) {
            throw new RuntimeException("failed to locate mother with id: "+family.getMother().getId());
        }
        List<People> childrenList = null;
        if (family.getChildren() != null) {
            List<Long> childrenIdList = family.getChildren().stream().map(child -> child.getId()).collect(Collectors.toList());
            childrenList = this.peopleDataRepo.findAllByIdList(childrenIdList);
            if (childrenIdList.size() != childrenList.size()) {
                List<String> idListInStr = childrenIdList.stream().map(it -> it.toString()).collect(Collectors.toList());
                throw new RuntimeException("failed to locate some of children: "
                        +String.join(", ", idListInStr));
            }
        }

        family.setId(0);
        family.setVersion(1);
        family.setChildren(childrenList);
        Family result = this.familyDataRepo.save(family);
        Optional<Family> reloaded = this.familyDataRepo.findById(result.getId());
        return reloaded.get();
    }

}
