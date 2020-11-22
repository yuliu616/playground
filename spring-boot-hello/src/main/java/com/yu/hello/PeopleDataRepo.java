package com.yu.hello;

import com.yu.model.Gender;
import com.yu.model.People;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PeopleDataRepo extends PagingAndSortingRepository<People, Integer> {

    Optional<People> findFirstByGender(Gender gender);

    List<People> findFirst10ByGender(Gender gender);

    @Query("select fm.mother from Family fm where (fm.father.id = :peopleId)")
    Optional<People> findWife(@Param("peopleId") int peopleId);

    @Query("select fm.father from Family fm where (fm.mother.id = :peopleId)")
    Optional<People> findHusband(@Param("peopleId") int peopleId);

}
