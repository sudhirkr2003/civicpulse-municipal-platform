package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.CitizenAnalyticsDTO;
import com.civicpulse.nexus.model.Citizen;
import com.civicpulse.nexus.service.CitizenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/citizens")
public class CitizenController {

    @Autowired
    private CitizenService citizenService;

    @GetMapping({"/satisfaction", "/analytics"})
    public ResponseEntity<CitizenAnalyticsDTO> getCitizenAnalytics() {
        return ResponseEntity.ok(citizenService.getCitizenAnalytics());
    }

    @GetMapping
    public ResponseEntity<List<Citizen>> getAllCitizens() {
        return ResponseEntity.ok(citizenService.getAllCitizens());
    }

    @PostMapping
    public ResponseEntity<Citizen> createCitizen(@RequestBody Citizen citizen) {
        return ResponseEntity.ok(citizenService.createCitizen(citizen));
    }
}
