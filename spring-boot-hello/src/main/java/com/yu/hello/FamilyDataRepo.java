package com.yu.hello;

import com.yu.model.Family;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FamilyDataRepo extends PagingAndSortingRepository<Family, Long> {

    Optional<Family> findByFatherId(long fatherId);

//    @Query("select f from Family f where f.father.id = :fatherId")
//    Optional<Family> findByFatherId(@Param("fatherId") int fatherId);

}
