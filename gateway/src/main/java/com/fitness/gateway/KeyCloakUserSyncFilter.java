package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeyCloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");

        RegisterRequest registerRequest = getUserDetails(token);

        if (userId == null) {
            userId = registerRequest.getKeyCloakId();
        }

        if (userId != null && token != null) {
            String finalUserId = userId;
            return userService.validateUser(userId)
                    .flatMap(exist -> {
                        if (!exist) {
                            //Register User

                            if (registerRequest != null)
                                return userService.registerUser(registerRequest)
                                        .then(Mono.empty());
                            else
                                return Mono.empty();
                        } else {
                            log.info("User already exists, Skipping sync.");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }
        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claimsSet.getStringClaim("email"));
            registerRequest.setKeyCloakId(claimsSet.getStringClaim("sub"));
            registerRequest.setFirstName(claimsSet.getStringClaim("given_name"));
            registerRequest.setLastName(claimsSet.getStringClaim("family_name"));
            registerRequest.setPassword("dummy@123123");

            log.info(registerRequest.toString());

            return registerRequest;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}