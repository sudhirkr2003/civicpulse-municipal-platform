package com.civicpulse.nexus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping({"/health", "/api/v1/health"})
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "CivicPulse Nexus Municipal Platform");
        health.put("version", "1.0.0");
        health.put("timestamp", Instant.now().toString());
        health.put("uptimeSeconds", ManagementFactory.getRuntimeMXBean().getUptime() / 1000);

        boolean dbConnected = false;
        String dbProduct = "Unknown";

        try (Connection conn = dataSource.getConnection()) {
            if (conn != null && conn.isValid(2)) {
                dbConnected = true;
                dbProduct = conn.getMetaData().getDatabaseProductName() + " " + conn.getMetaData().getDatabaseProductVersion();
            }
        } catch (Exception e) {
            dbConnected = false;
            health.put("databaseError", e.getMessage());
        }

        health.put("database", dbConnected ? "CONNECTED" : "DISCONNECTED");
        health.put("databaseProduct", dbProduct);

        if (!dbConnected) {
            health.put("status", "DEGRADED");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(health);
        }

        return ResponseEntity.ok(health);
    }
}
