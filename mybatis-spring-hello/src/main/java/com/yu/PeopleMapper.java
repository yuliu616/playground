package com.yu;

import com.yu.model.Gender;
import com.yu.model.People;
import org.apache.ibatis.annotations.Param;

public interface PeopleMapper {

    People findPeopleById(@Param("id") long id);

    People findLastInsertedPeople();

    long insertPeopleWithNamesAndGender(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("nickname") String nickname,
            @Param("gender") Gender gender);

    void insertPeopleWithModel(@Param("p") People people);

    long updatePeopleWithNameById(
            @Param("id") long id,
            @Param("version") long version,
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("nickname") String nickname
    );

    long updatePeopleWithModel(@Param("p") People people);

    long deletePeopleWithId(
            @Param("id") long id,
            @Param("version") long version
    );
}
