package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.DepartmentPerformanceDTO;
import com.civicpulse.nexus.dto.DepartmentPerformanceResponseDTO;
import com.civicpulse.nexus.model.Department;
import com.civicpulse.nexus.repository.DepartmentRepository;
import com.civicpulse.nexus.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/departments", "/api/departments"})
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @GetMapping("/performance")
    public ResponseEntity<DepartmentPerformanceResponseDTO> getDepartmentPerformance() {
        return ResponseEntity.ok(departmentService.getDepartmentPerformance());
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<DepartmentPerformanceDTO> getDepartmentDashboardById(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getDepartmentDashboardById(id));
    }
}
