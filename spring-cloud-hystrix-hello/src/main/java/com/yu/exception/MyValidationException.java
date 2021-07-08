package com.yu.exception;

public class MyValidationException extends RuntimeException {

    public MyValidationException() {
    }

    public MyValidationException(String message) {
        super(message);
    }

    public MyValidationException(String message, Throwable cause) {
        super(message, cause);
    }

    public MyValidationException(Throwable cause) {
        super(cause);
    }

}
