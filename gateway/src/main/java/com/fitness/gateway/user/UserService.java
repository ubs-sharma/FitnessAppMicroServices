package com.fitness.gateway.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final WebClient userServiceWebClient;

    public Mono<Boolean> validateUser(String userId) {

        log.info("Calling user validation API for UserId: {}", userId);

        return userServiceWebClient.get().uri("/api/users/{userId}/validate", userId)
                .retrieve().bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND)
                        throw new RuntimeException("User Not found: " + userId);
                    else if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                        throw new RuntimeException("Invalid request: " + userId);
                    else throw new RuntimeException("Please try again later: " + userId);
                });
    }

    public Mono<UserResponse> registerUser(RegisterRequest registerRequest) {

        log.info("Calling user registration API for email : {}", registerRequest.getEmail());
        log.info("Calling user registration API for getKeyCloakId : {}", registerRequest.getKeyCloakId());

        return userServiceWebClient.post().uri("/api/users/register")
                .bodyValue(registerRequest)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                        throw new RuntimeException("Bad Request: " + e.getMessage());
                    else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR)
                        throw new RuntimeException("Internal server error: " + e.getMessage());
                    else
                        throw new RuntimeException("Unexpected error has occurred. Please try again later: " + e.getMessage());
                });
    }
}