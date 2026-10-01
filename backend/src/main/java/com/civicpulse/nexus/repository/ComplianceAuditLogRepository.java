package com.civicpulse.nexus.repository;

import com.civicpulse.nexus.model.ComplianceAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplianceAuditLogRepository extends JpaRepository<ComplianceAuditLog, Long> {
    List<ComplianceAuditLog> findTop50ByOrderByTimestampDesc();
    List<ComplianceAuditLog> findByActionTypeOrderByTimestampDesc(String actionType);
}
