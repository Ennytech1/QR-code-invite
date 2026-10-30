# E2E Test Infra: QRInvite Platform

## Test Philosophy
- Opaque-box, requirement-driven. Derived from `ORIGINAL_REQUEST.md` and acceptance criteria.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|----------------------|:------:|:------:|:------:|
| 1 | Server Foundation & Error Handling | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ |
| 2 | Event Management REST APIs | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ |
| 3 | Guest Management & Tier Badging | ORIGINAL_REQUEST R1 | 5 | 5 | ✓ |
| 4 | Ticket Issuance & Pass Data | ORIGINAL_REQUEST R1, R3 | 5 | 5 | ✓ |
| 5 | Ed25519 Cryptographic Signing & Validation | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ |
| 6 | Gate Scanner Verification Engine | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ |
| 7 | Duplicate Scan Rejection with Timestamp | ORIGINAL_REQUEST R3, Acceptance | 5 | 5 | ✓ |
| 8 | Distributed Concurrency Mutex Locking | ORIGINAL_REQUEST R3 | 5 | 5 | ✓ |
| 9 | Client-Server Operational Lifecycle | ORIGINAL_REQUEST R4 | 5 | 5 | ✓ |
| 10 | Frontend Build & Route Integrity | ORIGINAL_REQUEST R2 | 5 | 5 | ✓ |

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | High-Profile Gala VIP Ingestion & Instant Pass Issuance | F2, F3, F4, F5, F6 | High |
| 2 | Peak Rush Multiple Gates Rapid Check-in | F6, F7, F8, F9 | High |
| 3 | Malicious Screenshot / Duplicate Scan Prevention at Turnstile | F6, F7, F8 | High |
| 4 | Offline Gate Manifest Caching & Reconnection Sync | F8, F9, F12 | High |
| 5 | Complete End-to-End Operational Lifecycle (Create -> Guest -> Pass -> Scan -> Stats) | F1-F12 | High |

## Test Architecture
- Test Runner: Node.js automated test runner / Jest / Supertest.
- Execution Command: `npm test` in `server/` and test runner scripts in root/test harness.
- Verification Target: All suites pass with exit code 0.

## Coverage Thresholds
- Tier 1: ≥5 per feature (50+ tests)
- Tier 2: ≥5 per feature boundary (50+ tests)
- Tier 3: Pairwise combinations across feature interactions
- Tier 4: ≥5 realistic application-level scenarios
- Total Target: 110+ comprehensive test assertions
