# SOC2 Type II Readiness & Security Controls

Miki Cloud & Enterprise VPC editions are designed to conform to the **AICPA SOC 2 Type II** Trust Services Criteria for Security, Availability, and Confidentiality.

---

## 1. Security Control Framework

| Trust Criteria | Implementation Control in Miki | Verification Status |
| :--- | :--- | :--- |
| **CC6.1 - Access Control** | Role-Based Access Control (RBAC) with granular API key scopes (`agent:read`, `agent:execute`, `keys:manage`). | ✅ Compliant |
| **CC6.6 - Boundary Protection** | mTLS encryption on socket streaming endpoints (Hermes Bridge) and TLS 1.3 in transit. | ✅ Compliant |
| **CC6.8 - Malware & Injection** | Sandboxed tool execution with AST validation on dynamic skill inputs. | ✅ Compliant |
| **CC7.2 - System Monitoring** | Live structured JSON logging and real-time audit event stream on `/telemetry`. | ✅ Compliant |

---

## 2. Audit Logging

All administrative actions (key creation, permission changes, skill installation) generate cryptographically hashed append-only audit events stored in the primary control database.
