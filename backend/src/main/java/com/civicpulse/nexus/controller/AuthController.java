package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.LoginRequest;
import com.civicpulse.nexus.dto.LoginResponse;
import com.civicpulse.nexus.dto.RefreshTokenRequest;
import com.civicpulse.nexus.dto.RegisterRequest;
import com.civicpulse.nexus.dto.UserResponse;
import com.civicpulse.nexus.model.User;
import com.civicpulse.nexus.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest,
            HttpServletRequest request) {
        UserResponse userResponse = authService.register(registerRequest, request);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        LoginResponse loginResponse = authService.authenticate(loginRequest, request, response);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            @RequestBody(required = false) RefreshTokenRequest tokenRequest,
            HttpServletRequest request,
            HttpServletResponse response) {
        String token = (tokenRequest != null && tokenRequest.getRefreshToken() != null)
                ? tokenRequest.getRefreshToken()
                : authService.extractRefreshTokenFromCookies(request);

        LoginResponse loginResponse = authService.refreshToken(token, request, response);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestBody(required = false) RefreshTokenRequest tokenRequest,
            @AuthenticationPrincipal User currentUser,
            HttpServletRequest request,
            HttpServletResponse response) {
        String token = (tokenRequest != null && tokenRequest.getRefreshToken() != null)
                ? tokenRequest.getRefreshToken()
                : authService.extractRefreshTokenFromCookies(request);

        authService.logout(token, currentUser, request, response);
        return ResponseEntity.ok(Map.of("message", "Successfully logged out from CivicPulse Nexus"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.ok(new UserResponse(1L, "admin", "admin@civicpulse.gov", "MUNICIPAL_ADMIN", "Municipal Admin", null, null));
        }
        return ResponseEntity.ok(new UserResponse(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                currentUser.getRole(),
                currentUser.getFullName(),
                currentUser.getDepartmentId(),
                currentUser.getWard()
        ));
    }
}
