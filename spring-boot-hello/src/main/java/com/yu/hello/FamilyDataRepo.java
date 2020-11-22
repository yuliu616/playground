package com.yu.hello;

import com.yu.model.Family;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FamilyDataRepo extends CrudRepository<Family, Integer> {

    Optional<Family> findByFatherId(int fatherId);

//    @Query("select f from Family f where f.father.id = :fatherId")
//    Optional<Family> findByFatherId(@Param("fatherId") int fatherId);

}
