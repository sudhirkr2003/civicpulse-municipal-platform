package com.civicpulse.nexus.dto;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String role;
    private String fullName;
    private Long departmentId;
    private String ward;

    public UserResponse() {}

    public UserResponse(Long id, String username, String email, String role, String fullName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
    }

    public UserResponse(Long id, String username, String email, String role, String fullName, Long departmentId, String ward) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.departmentId = departmentId;
        this.ward = ward;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
}
