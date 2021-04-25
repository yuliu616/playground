package com.yu;

import com.yu.exception.InconsistencyDataException;
import com.yu.exception.RecordNotFoundException;
import com.yu.model.Family;
import com.yu.model.Gender;
import com.yu.model.IdPair;
import com.yu.model.People;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequestMapping("/api/family")
@RestController()
public class FamilyController {

    @Autowired
    private FamilyMapper familyMapper;

    @Autowired
    private PeopleMapper peopleMapper;

    private static final long PAGE_SIZE_MIN = 1;
    private static final long PAGE_SIZE_SAFE_LIMIT = 100;

    private static final Logger logger = LoggerFactory.getLogger(FamilyController.class);

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
    public Family findFamilyById(
            @PathVariable("id") long id,
            @RequestParam(name="includeChildren", defaultValue = "false") boolean includeChildren
    ){
        Family family;
        if (includeChildren) {
            family = familyMapper.findFamilyWithChildrenById(id);
        } else {
            family = familyMapper.findFamilyById(id);
        }
        if (family == null) {
            throw new RuntimeException("family not found: "+id);
        }
        return family;
    }

    @GetMapping("")
    public List<Family> listAllFamily(
            @RequestParam(value = "offset", defaultValue = "0") long offset,
            @RequestParam(value = "size", defaultValue = "10") long size
    ){
        long safePageSize = Math.max(Math.min(size, PAGE_SIZE_SAFE_LIMIT), PAGE_SIZE_MIN);
        List<Family> list;
        list = this.familyMapper.listAllFamily(offset, safePageSize);
        return list;
    }

    @GetMapping("/{id}/children")
    public List<People> findFamilyChildrenById(
            @PathVariable("id") long id
    ){
        return peopleMapper.findPeopleByBornFamilyId(id);
    }

    @Transactional
    @PostMapping("")
    public Family createFamily(
            @Valid @RequestBody() Family family
    ){
        People father = this.peopleMapper.findPeopleById(family.getFatherId());
        People mother = this.peopleMapper.findPeopleById(family.getMotherId());
        if (father == null) {
            throw new RuntimeException("failed to locate father with id: "+family.getFatherId());
        } else if (father.getGender() != Gender.MALE) {
            throw new RuntimeException("invalid father with id: "+family.getFatherId());
        }
        if (mother == null) {
            throw new RuntimeException("failed to locate mother with id: "+family.getMotherId());
        } else if (mother.getGender() != Gender.FEMALE) {
            throw new RuntimeException("invalid mother with id: "+family.getMotherId());
        }
        if (family.getChildren() != null) {
            List<Long> childrenIdList = family.getChildren().stream().map(child -> child.getId()).collect(Collectors.toList());
            List<People> childrenList = this.peopleMapper.findPeopleByIdList(childrenIdList);
            if (childrenIdList.size() != childrenList.size()) {
                List<String> idListInStr = childrenIdList.stream().map(it -> it.toString()).collect(Collectors.toList());
                throw new RuntimeException("failed to locate some of children: "
                        +String.join(", ", idListInStr));
            }
        }

        long familyCreated = this.familyMapper.insertFamily(family);
        if (familyCreated < 1) {
            throw new RuntimeException("failed to create family");
        }
        if (!family.getChildren().isEmpty()) {
            List<IdPair> childMappingList = family.getChildren().stream().map(child -> {
                return new IdPair(family.getId(), child.getId());
            }).collect(Collectors.toList());
            long childMappingCreated = this.familyMapper.insertFamilyChild(childMappingList);
            if (childMappingCreated != family.getChildren().size()) {
                throw new RuntimeException("failed to assign family to children");
            }
        }
        return this.findFamilyById(family.getId(), true);
    }

}
