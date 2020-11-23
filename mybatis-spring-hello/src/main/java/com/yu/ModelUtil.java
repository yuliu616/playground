package com.yu;

import com.yu.model.IHasId;

import java.util.List;
import java.util.stream.Collectors;

public class ModelUtil {

    public static <T extends IHasId> List<Long> idList(List<T> list){
        return list.stream().map(p -> p.getId()).collect(Collectors.toList());
    }

}
