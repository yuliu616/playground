package com.yu.util;

import com.alibaba.fastjson.JSONObject;
import com.yu.exception.UnhandledException;
import com.yu.model.dto.ErrorCodeDto;
import feign.FeignException;

public class FeignUtil {

    public static final String ERROR_INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

    public static ErrorCodeDto convertFeignException(FeignException feignException) {
        if (feignException.status() == 400) {
            ErrorCodeDto errorDto = JSONObject.parseObject(feignException.contentUTF8(), ErrorCodeDto.class);
            return errorDto;
        }
        throw new UnhandledException(feignException);
    }

}
