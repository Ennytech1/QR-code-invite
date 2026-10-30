# Project: QRInvite Platform

## Architecture
QRInvite is an institutional-grade access control and digital invitation management platform built with:
- **Backend (`server/`)**: Node.js/Express REST server with Mongoose/MongoDB persistence, native Node.js RFC 8032 Ed25519 asymmetric cryptography, AES-256-GCM private key envelope encryption, and distributed atomic concurrency locking (Redis with in-memory mutex fallback).
- **Frontend (`client/`)**: Vite + React 19 + Tailwind CSS v4 Single Page Application with dual public/organizer shells, Web Audio API frequency synthesis, optical camera barcode decoding loop (`BarcodeDetector`/canvas fallback), dynamic QR rendering, and API service integration.
- **Data Flow**:
  1. Organizer creates event -> Server generates Ed25519 keypair (saves public key + AES-encrypted private key).
  2. Organizer adds attendees (single or bulk CSV) -> Server creates Guest and Ticket records, signs compact payload `tid|eid|n|t|iat` with event private key, and returns Base64URL token.
  3. Attendee accesses digital pass -> Frontend renders dynamic QR barcode and pass details.
  4. Gate scanner captures QR optically or manually -> Transmits payload to `POST /api/scan/verify`.
  5. Scan verification engine -> Verifies Ed25519 signature -> Acquires atomic concurrency lock -> Atomic conditional DB update (`status = 'VALID' -> 'CHECKED_IN'`) -> On duplicate, returns HTTP 409 with prior scan timestamp -> On success, grants access and logs to `CheckInLog`.

## Feature Inventory
| # | Feature | Description | Milestone | Status |
|---|---------|-------------|-----------|--------|
| F1 | Server Boot & Error Foundation | Fix missing `errorResponse`, broken imports in `userController`, and DB connection fallback | M1 | VERIFIED & DONE |
| F2 | Core Data Models | Schema definitions for Event, Guest, Ticket, and CheckInLog | M1 | VERIFIED & DONE |
| F3 | Event Management REST APIs | Endpoints `/api/events`, `/api/events/:id`, `/api/events/:id/stats` | M1 | VERIFIED & DONE |
| F4 | Guest Management REST APIs | Endpoints `/api/guests`, `/api/guests/bulk`, `/api/guests/:id` | M1 | VERIFIED & DONE |
| F5 | Ticket & Pass REST APIs | Endpoints `/api/tickets`, `/api/tickets/:id`, `/api/tickets/:id/pass` | M1 | VERIFIED & DONE |
| F6 | Ed25519 Asymmetric Cryptography | Keypair generation, AES-256-GCM private key storage, canonical QR signing & verification | M1 | VERIFIED & DONE |
| F7 | Concurrency Locking Service | Distributed atomic mutex (`ticket:lock:{id}`) via Redis with in-memory TTL Map fallback | M1 | VERIFIED & DONE |
| F8 | Scan Verification API & Duplicate Rejection | `POST /api/scan/verify` with atomic status update, duplicate detection with prior timestamp, and `POST /api/scan/sync` | M1 | VERIFIED & DONE |
| F9 | Frontend Routing & Missing Pages | Create `LiveGatesPage`, `PublicPassPage`, and mount in `App.jsx` (`/gates`, `/pass/:id`) | M2 | VERIFIED & DONE |
| F10 | UI Refinement & Dynamic QR Rendering | Fix tier badging in `GuestsPage`, replace static SVG in `TicketPassModal` with real dynamic QR, full-screen scanner HUD pulse | M2 | VERIFIED & DONE |
| F11 | Optical Camera Barcode Decoding Loop | Continuous video frame analysis via `BarcodeDetector` (with canvas fallback) in `ScannerPage` | M3 | VERIFIED & DONE |
| F12 | Client-Server API Integration | Connect `EventContext` to backend REST APIs via `client/src/services/api.js` with offline fallback | M3 | VERIFIED & DONE |
| F13 | E2E Test Suite (Tiers 1-4) | Comprehensive test harness executing Feature, Boundary, Combinatorial, and Real-World scenarios | M_E2E | VERIFIED & DONE |
| F14 | Adversarial Coverage Hardening (Tier 5) | White-box challenger penetration tests against replay, race conditions, and forged tokens | M_E2E | VERIFIED & DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Complete Backend Services & Cryptographic Gate Access Engine | F1, F2, F3, F4, F5, F6, F7, F8 | none | DONE |
| M2 | Frontend UI/UX Refinement & Complete Section Buildout | F9, F10 | none | DONE |
| M3 | Client-Server Integration & Optical Scanner Hardware Flow | F11, F12 | M1, M2 | DONE |
| M_E2E | E2E Testing Track & Acceptance Verification | F13, F14 | Parallel with M1-M3 | DONE |

## Interface Contracts
### Client ↔ Server REST API Contracts
- `POST /api/events`:
  - Request: `{ name, category, venue, date, time, capacity, description, ... }`
  - Response: `{ success: true, event: { _id, name, publicKey, ... } }`
- `POST /api/guests`:
  - Request: `{ eventId, name, email, phone, tier, table, plusOnes }`
  - Response: `{ success: true, guest: { _id, ... }, ticket: { _id, qrToken, signature, compactQrPayload, ... } }`
- `POST /api/guests/bulk`:
  - Request: `{ eventId, guests: [...] }`
  - Response: `{ success: true, count, guests: [...] }`
- `POST /api/scan/verify`:
  - Request: `{ qrPayload, gateName, scannerId }`
  - Response (Success 200): `{ success: true, status: 'SUCCESS', message: 'Access Granted', ticket, guest }`
  - Response (Duplicate 409): `{ success: false, status: 'DUPLICATE', message: '...', checkInTime, gateScanned, scanCount, guestName, tier }`
  - Response (Forged/Invalid 400): `{ success: false, status: 'FORGED' | 'INVALID', message: '...' }`

### Cryptographic Token Contract (`compactQrPayload`)
- Raw Canonical Data: `${tid}|${eid}|${n}|${t}|${iat}`
- Compact JSON: `{"tid":"...","eid":"...","n":"...","t":"...","iat":1234567890,"sig":"..."}`
- Token format in QR: Base64URL-encoded compact JSON string.

## Code Layout
- Backend (`server/`):
  - `server/index.js` — Express application entry point
  - `server/config/db.js` — Database connection with local/in-memory fallback
  - `server/utils/errorResponse.js` — Custom error response class
  - `server/models/` — `Event.js`, `Guest.js`, `Ticket.js`, `CheckInLog.js`, `User.js`, `Notification.js`
  - `server/services/cryptoService.js` — Ed25519 keypair & AES-256-GCM & signature verification
  - `server/services/lockService.js` — Redis concurrency lock with TTL Map fallback
  - `server/controllers/` — `eventController.js`, `guestController.js`, `ticketController.js`, `scanController.js`, `userController.js`
  - `server/routes/` — `eventRoutes.js`, `guestRoutes.js`, `ticketRoutes.js`, `scanRoutes.js`, `userRoutes.js`
  - `server/tests/` — Automated test suites: `crypto.test.js`, `lock.test.js`, `api.test.js`, `concurrency_stress.test.js`, `adversarial_forgery_replay.test.js`, `runAll.js`
- Frontend (`client/`):
  - `client/src/App.jsx` — Router configuration and shell routing (`/gates`, `/live`, `/pass/:id`)
  - `client/src/services/api.js` — Backend REST API client with 4xx error preservation
  - `client/src/context/EventContext.jsx` — State management integrating API and localStorage with dual sync/promise verification
  - `client/src/pages/` — All public and organizer pages including `LiveGatesPage.jsx` and `PublicPassPage.jsx`
  - `client/src/components/modals/TicketPassModal.jsx` — Real dynamic QR generation
  - `client/src/pages/ScannerPage.jsx` — Optical video frame BarcodeDetector loop, HUD pulse overlay, audio cues
