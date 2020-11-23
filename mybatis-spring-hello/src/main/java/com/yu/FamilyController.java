package com.yu;

import com.yu.model.Family;
import com.yu.model.Gender;
import com.yu.model.People;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RequestMapping("/hello/family")
@RestController()
public class FamilyController {

    @Autowired
    private FamilyMapper familyMapper;

    @Autowired
    private PeopleMapper peopleMapper;

    private static final Logger logger = LoggerFactory.getLogger(FamilyController.class);

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> throwable(Throwable throwable) {
        logger.error("Uncaught throwable", throwable);
        return Collections.singletonMap("message", throwable.getMessage());
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

    @GetMapping("/{id}/children")
    public List<People> findFamilyChildrenById(
            @PathVariable("id") long id
    ){
        return peopleMapper.findPeopleByBornFamilyId(id);
    }

    @Transactional
    @PostMapping("")
    public Family createFamily(
            @RequestBody() Family family
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
//        List<People> childrenOfFamily = this.peopleMapper.findPeopleByIdList(
//            ModelUtil.idList(family.getChildren())
//        );
//        if (childrenOfFamily.size() != family.getChildren().size()) {
//            logger.warn("got children in db: ({})",
//                String.join(",",
//                    childrenOfFamily.stream().map(p->String.valueOf(p.getId())).collect(Collectors.toList())
//                )
//            );
//            throw new RuntimeException("invalid children");
//        }

        long familyCreated = this.familyMapper.insertFamily(family);
        if (familyCreated < 1) {
            throw new RuntimeException("failed to create family");
        }
        long peopleUpdated = this.peopleMapper.assignBornFamilyToPeople(
                ModelUtil.idList(family.getChildren()),
                family.getId());
        if (peopleUpdated != family.getChildren().size()) {
            throw new RuntimeException("failed to assign family to children");
        }
        return this.findFamilyById(family.getId(), true);
    }

}
