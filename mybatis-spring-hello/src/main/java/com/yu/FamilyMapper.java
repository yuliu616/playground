package com.yu;

import com.yu.model.Family;
import com.yu.model.People;
import org.apache.ibatis.annotations.Param;

public interface FamilyMapper {

    Family findFamilyById(@Param("id") long id);

    Family findFamilyWithChildrenById(@Param("id") long id);

    long insertFamily(@Param("f") Family family);

}
