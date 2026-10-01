INSERT INTO departments (id, name, code, target_sla_percentage, director_name, budget_allocated, budget_utilized, current_sla_performance) VALUES
(1, 'Water Management', 'WTR', 90.0, 'Dr. Robert Sterling', 12500000.0, 11200000.0, 94.0),
(2, 'Public Health', 'HLT', 90.0, 'Dr. Evelyn Vance', 10200000.0, 8900000.0, 91.0),
(3, 'Civic Education', 'EDU', 90.0, 'Marcus Thorne', 8700000.0, 7800000.0, 89.0),
(4, 'Roads & Infrastructure', 'RDS', 85.0, 'Elena Rostova', 9800000.0, 8400000.0, 86.0),
(5, 'Revenue & Treasury', 'REV', 92.0, 'Claire Beauchamp', 5800000.0, 4700000.0, 95.0);

INSERT INTO budget_allocations (id, department_id, fiscal_year, allocated_amount, utilized_amount, capex_amount, opex_amount) VALUES
(1, 1, 'FY-2026', 12500000.0, 11200000.0, 8200000.0, 3000000.0),
(2, 2, 'FY-2026', 10200000.0, 8900000.0, 5800000.0, 3100000.0),
(3, 3, 'FY-2026', 8700000.0, 7800000.0, 4900000.0, 2900000.0),
(4, 4, 'FY-2026', 9800000.0, 8400000.0, 6800000.0, 1600000.0),
(5, 5, 'FY-2026', 5800000.0, 4700000.0, 2700000.0, 2000000.0);

INSERT INTO revenue_transactions (id, transaction_ref, category, amount, payer_name, payment_status, payment_date, payment_method, ward) VALUES
(1, 'TXN-REV-8801', 'PROPERTY_TAX', 8310000.0, 'Apex Real Estate Holdings', 'COMPLETED', CURRENT_TIMESTAMP, 'ACH_TRANSFER', 'Ward 1 - Downtown Metro'),
(2, 'TXN-REV-8802', 'BUSINESS_LICENSE', 2850000.0, 'TechVentures Global Inc', 'COMPLETED', CURRENT_TIMESTAMP, 'ONLINE_CARD', 'Ward 4 - Tech Corridor'),
(3, 'TXN-REV-8803', 'PERMITS', 1240000.0, 'Harbor Infrastructure Consortium', 'COMPLETED', CURRENT_TIMESTAMP, 'ACH_TRANSFER', 'Ward 6 - Harborview Heights');
