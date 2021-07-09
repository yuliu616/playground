package com.yu.controller;

import com.yu.exception.MyValidationException;
import com.yu.exception.UnhandledException;
import com.yu.model.dto.ErrorCodeDto;
import com.yu.model.dto.ErrorDto;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ValidationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public static final String ERROR_INVALID_USE_ERROR = "INVALID_USE_ERROR";

    public static final String ERROR_VALIDATION_ERROR = "VALIDATION_ERROR";

    public static final String ERROR_INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

    public static final String ERROR_UNKNOWN_ERROR = "UNKNOWN_ERROR";

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(java.sql.SQLIntegrityConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto sqlLevelException(java.sql.SQLIntegrityConstraintViolationException exception){
        logger.warn("sqlLevelException: {}", exception.getMessage(), exception);
        return new ErrorCodeDto(ERROR_INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UnhandledException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto unknownError(UnhandledException exception){
        logger.warn("unknownError: {}", exception.getMessage(), exception);
        return new ErrorCodeDto(ERROR_UNKNOWN_ERROR);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto mvcValidationFailure(org.springframework.web.bind.MethodArgumentNotValidException exception){
        logger.warn("mvcValidationFailure: {}", exception.getMessage(), exception);
        return new ErrorCodeDto(ERROR_VALIDATION_ERROR);
    }

    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto mvcWrongTypeFailure(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException exception){
        logger.warn("mvcWrongTypeFailure: {}", exception.getMessage(), exception);
        return new ErrorCodeDto(ERROR_VALIDATION_ERROR);
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto validationFailure(ValidationException exception){
        logger.warn("validationFailure: {}", exception.getMessage(), exception);
        return new ErrorCodeDto(ERROR_VALIDATION_ERROR);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto httpBodyParsingError(org.springframework.http.converter.HttpMessageNotReadableException exception){
        logger.warn("httpBodyParsingError: {}", exception.getMessage(), exception);
        return new ErrorCodeDto(ERROR_INVALID_USE_ERROR);
    }

    @ExceptionHandler(MyValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto myValidationFailure(MyValidationException exception){
        logger.warn("myValidationFailure: {}", exception.getMessage(), exception);
        return new ErrorCodeDto(ERROR_VALIDATION_ERROR);
    }

    @ExceptionHandler(FeignException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto feignCallFailure(FeignException exception){
        logger.warn("feignCallFailure: {}", exception.getMessage(), exception);
        return new ErrorCodeDto(ERROR_INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(com.netflix.hystrix.exception.HystrixRuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto hystrixRuntimeFailure(com.netflix.hystrix.exception.HystrixRuntimeException exception){
        logger.warn("HystrixRuntimeException: {}", exception.getMessage(), exception);
        return new ErrorDto("HystrixRuntimeException", new Object[]{ exception.getMessage() });
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorCodeDto generalRuntimeException(RuntimeException exception){
        logger.warn("generalRuntimeException: {}", exception.getMessage(), exception);
        return new ErrorDto(ERROR_UNKNOWN_ERROR, new Object[]{ exception.getMessage() });
    }

}
