package com.yu;

import com.yu.model.Gender;
import com.yu.model.People;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PeopleMapper {

    People findPeopleById(@Param("id") long id);

    List<People> listAllPeople(
            @Param("isActive") boolean isActive,
            @Param("pageOffset") long pageOffset,
            @Param("pageSize") long pageSize);

    List<People> listAllPeople2(
            @Param("pageOffset") long pageOffset,
            @Param("pageSize") long pageSize);

    List<People> findPeopleByIdList(@Param("idList") List<Long> idList);

    List<People> findPeopleByBornFamilyId(@Param("bornFamilyId") long bornFamilyId);

    long countAll();

    People findWifeByHusbandId(@Param("husbandId") long husbandId);

    People findHusbandByWifeId(@Param("wifeId") long wifeId);

    People findLastInsertedPeople();

    long insertPeopleWithNamesAndGender(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("nickname") String nickname,
            @Param("gender") Gender gender);

    long insertPeopleWithModel(@Param("it") People people);

    long updatePeopleWithNameById(
            @Param("id") long id,
            @Param("version") long version,
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("nickname") String nickname
    );

    long updatePeopleWithModel(@Param("it") People people);

    long deletePeopleWithId(
            @Param("id") long id,
            @Param("version") long version
    );

    long disablePeopleWithId(
            @Param("id") long id,
            @Param("version") long version
    );
}
