package com.fitness.userservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}