package com.yu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class DigestUtil {

    private static Base64.Encoder base64Encoder = Base64.getEncoder();

    private static Logger logger = LoggerFactory.getLogger(DigestUtil.class);

    public static String digestString(String input) {
        try {
            var sha256 = MessageDigest.getInstance("SHA-256");
            byte[] bytes = input.getBytes("UTF-8");
            byte[] resultDigest = sha256.digest(bytes);
            return base64Encoder.encodeToString(resultDigest);
        } catch (NoSuchAlgorithmException | UnsupportedEncodingException ex) {
            logger.error("error calculating MessageDigest", ex);
            return "????";
        }
    }

    public static MessageDigest createDigest(){
        try {
            return MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException ex) {
            logger.error("error calculating MessageDigest", ex);
            throw new RuntimeException(ex);
        }
    }

}
