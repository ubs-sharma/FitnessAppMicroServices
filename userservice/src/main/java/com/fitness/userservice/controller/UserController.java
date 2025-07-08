package com.fitness.userservice.controller;

import com.fitness.userservice.UserserviceApplication;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId) {

        return ResponseEntity.ok(userService.getUserProfile(userId));
    }


    @GetMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {

        return ResponseEntity.ok(userService.register(request));
    }
}