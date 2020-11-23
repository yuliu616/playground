package com.yu;

import com.yu.model.Gender;
import com.yu.model.People;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PeopleMapper {

    People findPeopleById(@Param("id") long id);

    List<People> findPeopleByIdList(@Param("idList") List<Long> idList);

    List<People> findPeopleByBornFamilyId(@Param("bornFamilyId") long bornFamilyId);

    People findWifeByHusbandId(@Param("husbandId") long husbandId);

    People findHusbandByWifeId(@Param("wifeId") long wifeId);

    People findLastInsertedPeople();

    long insertPeopleWithNamesAndGender(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("nickname") String nickname,
            @Param("gender") Gender gender);

    long insertPeopleWithModel(@Param("p") People people);

    long updatePeopleWithNameById(
            @Param("id") long id,
            @Param("version") long version,
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("nickname") String nickname
    );

    long updatePeopleWithModel(@Param("p") People people);

    long assignBornFamilyToPeople(
            @Param("idList") List<Long> idList,
            @Param("bornFamilyId") long bornFamilyId);

    long deletePeopleWithId(
            @Param("id") long id,
            @Param("version") long version
    );
}
