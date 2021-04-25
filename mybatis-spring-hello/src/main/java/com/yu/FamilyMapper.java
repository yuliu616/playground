package com.yu;

import com.yu.model.Family;
import com.yu.model.IdPair;
import com.yu.model.People;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface FamilyMapper {

    Family findFamilyById(@Param("id") long id);

    List<Family> listAllFamily(
            @Param("pageOffset") long pageOffset,
            @Param("pageSize") long pageSize);

    Family findFamilyWithChildrenById(@Param("id") long id);

    Family findFamilyByFatherId(@Param("id") long id);

    long insertFamily(@Param("f") Family family);

    long insertFamilyChild(@Param("pairList") List<IdPair> pairList);

    long assignBornFamilyToPeople(
            @Param("idList") List<Long> idList,
            @Param("bornFamilyId") long bornFamilyId);


}
