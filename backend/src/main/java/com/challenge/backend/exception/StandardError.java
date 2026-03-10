package com.challenge.backend.exception;

public record StandardError(
        Integer status,
        String errorType,
        String message,
        Long timestamp
) {
}