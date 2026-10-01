package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.PermitSummaryDTO;
import com.civicpulse.nexus.dto.StatusUpdateDTO;
import com.civicpulse.nexus.model.Permit;
import com.civicpulse.nexus.service.PermitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/permits")
public class PermitController {

    @Autowired
    private PermitService permitService;

    @GetMapping("/summary")
    public ResponseEntity<PermitSummaryDTO> getPermitsSummary() {
        return ResponseEntity.ok(permitService.getPermitsSummary());
    }

    @GetMapping
    public ResponseEntity<List<Permit>> getAllPermits() {
        return ResponseEntity.ok(permitService.getAllPermits());
    }

    @PostMapping
    public ResponseEntity<Permit> createPermit(@RequestBody Permit permit) {
        return ResponseEntity.ok(permitService.createPermit(permit));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Permit> updatePermitStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(permitService.updateStatus(id, statusUpdateDTO));
    }
}
