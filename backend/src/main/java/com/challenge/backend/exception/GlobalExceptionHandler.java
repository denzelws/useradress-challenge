package com.challenge.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<StandardError> handleBusinessException(BusinessException ex) {

        StandardError error = new StandardError(
                HttpStatus.UNPROCESSABLE_ENTITY.value(),
                "Violação de Regra de Negócio",
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardError> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        StandardError error = new StandardError(
                HttpStatus.CONFLICT.value(),
                "Conflito de Dados",
                "Já existe um registro com estes dados únicos (ex: CPF) no sistema.",
                System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}