package com.example.spring_boot_exam.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.spring_boot_exam.dto.ApiResponse;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handlerResourceNotFound(ResourceNotFoundException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage())
                .success(false)
                .data(null)
                .build();
        return ResponseEntity.status(404).body(response);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handlerDuplicateResource(DuplicateResourceException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message(ex.getMessage())
                .success(false)
                .data(null)
                .build();
        return ResponseEntity.status(409).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handlerMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        ApiResponse<Object> response = ApiResponse.builder()
                .message("Validation failed")
                .success(false)
                .data(null)
                .errors(errors)
                .build();
        return ResponseEntity.status(400).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handlerGenericException(Exception ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .message("Internal server error")
                .success(false)
                .data(null)
                .build();
        return ResponseEntity.status(500).body(response);
    }

}
