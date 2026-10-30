# 🎟️ QRInvite — Tamper-Resistant Digital Invitation & Gate Access Platform

> **Status:** Approved for Development | **Version:** 1.0  
> **Target Platforms:** Web (Desktop/Mobile Responsive Admin Portal) & Cross-Platform PWA (Gate Scanner)

QRInvite is an institutional-grade access control and digital invitation management system built to eliminate paper-based guest lists, ticket fraud, and entry bottlenecks at private and corporate events. It equips event hosts with tools to register attendees, issue cryptographically signed QR code digital passes via WhatsApp, Email, and SMS, and verify guest identity at event gates within sub-second latency windows (<300 ms online, <100 ms offline)—even under degraded network connectivity.

---

## 📑 Table of Contents
1. [Core Problems & Solutions](#-core-problems--solutions)
2. [End-to-End System Architecture](#-end-to-end-system-architecture)
3. [Cryptographic Token Specification (Ed25519)](#-cryptographic-token-specification-ed25519)
4. [Anti-Replay & Concurrency Locking (Zero Double-Spend)](#-anti-replay--concurrency-locking-zero-double-spend)
5. [Offline Verification & Synchronization Engine](#-offline-verification--synchronization-engine)
6. [Operator Visual & Audio UX (Green / Red Cues)](#-operator-visual--audio-ux-green--red-cues)
7. [Data Model & Schema (ERD)](#-data-model--schema-erd)
8. [API Endpoints Specification](#-api-endpoints-specification)
9. [Project Directory Structure](#-project-directory-structure)
10. [Technology Stack](#-technology-stack)
11. [Getting Started & Local Setup](#-getting-started--local-setup)
12. [Milestones & Roadmap](#-milestones--roadmap)

---

## 💡 Core Problems & Solutions

| Challenge in Traditional Events | QRInvite Solution |
| :--- | :--- |
| **Entry Bottlenecks:** Manual search & paper check-offs take 20–45s per attendee. | **Sub-second Optical Scanning:** Fast camera scan with local Ed25519 signature checks in under 100 ms. |
| **Gate Fraud & Duplication:** Guests screenshot or photocopy passes for uninvited friends. | **Asymmetric Signatures & Redis Atomic Locks:** Cryptographically signed tokens with distributed atomic concurrency locks prevent double-spend across multiple gates. |
| **Flaky Gate Connectivity:** Gate entrances frequently suffer from congested or dead cellular networks. | **Offline-First PWA:** Local cryptographic verification via cached public keys in IndexedDB; scan logs queue locally and sync automatically when reconnected. |
| **Distribution Waste & Misplaced Passes:** Printed cards are costly, slow to deliver, and easily lost. | **Multi-Channel Instant Dispatch:** Automated delivery straight to guest WhatsApp, Email (with Apple Wallet `.pkpass`), and SMS fallback. |

---

## 🏛️ End-to-End System Architecture

```
[ Organizer Portal ]                     [ Messaging Pipeline ]                   [ Gate Scanner (PWA) ]
  • Event Creation                         • WhatsApp Cloud API                     • Optical Camera (HTML5)
  • Bulk CSV Guest Ingestion  ────────►    • Resend / SMTP Email       ────────►    • Local Ed25519 Verification
  • Ed25519 Keypair Gen                    • SMS Fallback Link                      • Redis Atomic Lock
  • Live Telemetry Monitor                                                          • Audio/Visual Feedback
                                                                                    • Offline IndexedDB Queue
```

### End-to-End User Flow
```
[Organizer creates event] ──► [Bulk CSV/Manual Guest Entry]
                                         │
                                         ▼
                            [Generate Ed25519 Signed QR]
                                         │
                                         ▼
                        [Automated Dispatch: WhatsApp / Email]
                                         │
                                         ▼
[Guest Arrives at Venue] ──► [Presents QR on Mobile Screen]
                                         │
                                         ▼
                        [Scanner App Reads Payload]
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
          [Valid Signature]                              [Invalid / Replay]
                 │                                               │
      [Acquire Atomic Lock]                               [Screen: RED]
                 │                                      [Play Error Buzzer]
        ┌────────┴────────┐
        ▼                 ▼
   [Unused Token]    [Already Scanned]
        │                 │
  [Screen: GREEN]   [Screen: RED]
  [Haptic Beep]     [Show "Scanned 12m ago"]
```

---

## 🔐 Cryptographic Token Specification (Ed25519)

Every invitation pass contains an asymmetric digital signature preventing forgery or tampering with guest identity or access tiers.

### 1. Keypair Management
- Each event automatically generates an **Ed25519 keypair** upon creation:
  - `private_key`: Encrypted at rest (AES-256-GCM) with an application master secret on the server; never exposed to gate scanners.
  - `public_key`: Distributed to authorized gate scanner devices during event onboarding or cached in client-side IndexedDB.

### 2. QR Payload Structure (Compact Base64URL JSON)
```json
{
  "tid": "4fa85f64-5717-4562-b3fc-2c963f66afa6",
  "eid": "8f3b610c-9821-4f9e-a0e4-b7f735870b20",
  "n": "Kelechi Okafor",
  "t": "VIP",
  "iat": 1718449200,
  "sig": "3a4b7f9e8d1c2...[Ed25519 64-byte signature in base64url]"
}
```

### 3. Verification Sequence
1. Optical scanner captures the QR image and parses the payload.
2. The scanner extracts `sig` and computes:
   $$\text{valid} = \text{Ed25519Verify}(\text{sig}, \text{payloadWithoutSig}, \text{eventPublicKey})$$
3. If signature verification fails, the ticket is **immediately rejected (<20 ms)** without network round-trips.

---

## ⚡ Anti-Replay & Concurrency Locking (Zero Double-Spend)

When a guest sends a screenshot to a friend and both attempt entry at different gates simultaneously, QRInvite guarantees **Zero Double-Spend**:

1. **Redis Atomic Lock Acquisition:**
   ```bash
   SET ticket:lock:{ticket_id} {scanner_id} NX EX 5
   ```
   - Only the first gate scanner to acquire the lock proceeds.
   - Any concurrent scan at another gate is immediately rejected.
2. **Database Atomic State Transition:**
   ```sql
   UPDATE tickets
   SET status = 'CHECKED_IN',
       check_in_time = NOW(),
       scanned_by_device = $scanner_id,
       scan_count = scan_count + 1
   WHERE id = $ticket_id AND status = 'VALID';
   ```
3. If `0` rows were updated (ticket already checked in), the scanner immediately triggers the **DUPLICATE** response showing the exact prior check-in timestamp and gate name.

---

## 📴 Offline Verification & Synchronization Engine

Gate staff must be able to scan guests even if the venue's network drops completely:

1. **Local Public Key & Roster Cache:** On gate scanner login, the event public key and latest guest roster snapshot are saved to browser `IndexedDB`.
2. **Offline Local Verification:**
   - Ed25519 signature verified directly in Web Worker / WASM.
   - Ticket marked as checked in within the local IndexedDB state.
   - Scan event added to `offline_checkin_queue`.
3. **Automatic Flush & Sync:**
   - PWA listens to the browser `online` event and polls heartbeat.
   - Once network is restored, queued check-ins are batch-posted to `/api/scan/sync`.
   - Server resolves conflicts using atomic idempotency keys.

---

## 🎨 Operator Visual & Audio UX (Green / Red Cues)

Door bouncers and gate staff require instantaneous, unambiguous cues:

| Status | Visual Feedback | Audio / Haptic Feedback | Operator Display |
| :--- | :--- | :--- | :--- |
| **VALID (Unused)** | Full-screen **GREEN** pulse | High-pitch chime (880 Hz tone) + Double vibration | Guest Name, VIP/Regular Tier, "ACCESS GRANTED" |
| **DUPLICATE (Already Scanned)** | Full-screen **RED** flash | Low harsh buzzer (180 Hz tone) + Long vibration | "ALREADY CHECKED IN" with original check-in timestamp (e.g., "Scanned 14m ago at Gate North") |
| **INVALID / FORGED** | Full-screen **RED** warning | Low error buzz + Urgent vibration | "TICKET NOT RECOGNIZED / SIGNATURE INVALID" |

---

## 📊 Data Model & Schema (ERD)

```
[Organizers] 1 ──── N [Events]
                        │
                        ├──── N [Guests]
                        │        │
                        │        └─── 1 [Tickets] ──── N [CheckInLogs]
                        │
                        └──── N [ScannerDevices]
```

### Core Entities

#### `events`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique event identifier |
| `organizer_id` | UUID (FK) | Reference to `organizers` |
| `name` | VARCHAR(255) | Event title |
| `venue` | VARCHAR(255) | Venue name and address |
| `event_date` | TIMESTAMP | Scheduled start timestamp |
| `capacity` | INTEGER | Maximum venue capacity |
| `public_key` | TEXT | Event Ed25519 public key (distributed to scanners) |
| `private_key_encrypted`| TEXT | Encrypted Ed25519 private key (AES-256) |
| `status` | ENUM | `DRAFT`, `ACTIVE`, `COMPLETED`, `ARCHIVED` |

#### `guests`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique guest identifier |
| `event_id` | UUID (FK) | Reference to `events` |
| `full_name` | VARCHAR(255) | Attendee full name |
| `email` | VARCHAR(255) | Email address |
| `phone_number` | VARCHAR(50) | WhatsApp/SMS phone number (E.164 format) |
| `tier` | VARCHAR(50) | `REGULAR`, `VIP`, `VVIP`, `VENDOR`, `STAFF` |

#### `tickets`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique ticket identifier (matches `tid` in QR) |
| `event_id` | UUID (FK) | Reference to `events` |
| `guest_id` | UUID (FK) | Reference to `guests` |
| `status` | ENUM | `ISSUED`, `VALID`, `CHECKED_IN`, `REVOKED` |
| `check_in_time` | TIMESTAMP | Nullable timestamp of successful check-in |
| `scanned_by` | UUID (FK) | Scanner device or user ID |
| `scan_count` | INTEGER | Total scan attempts recorded |

#### `check_in_logs`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique log entry identifier |
| `ticket_id` | UUID (FK) | Reference to `tickets` |
| `event_id` | UUID (FK) | Reference to `events` |
| `scanner_device_id` | UUID (FK) | Reference to `scanner_devices` |
| `result` | ENUM | `SUCCESS`, `DUPLICATE`, `INVALID` |
| `gate_name` | VARCHAR(100) | Name of gate (e.g., Gate A, VIP West) |
| `scanned_at` | TIMESTAMP | Exact scan timestamp |

---

## 🌐 API Endpoints Specification

### Authentication & Organizer
- `POST /api/auth/register` — Register new event organizer account
- `POST /api/auth/login` — Login & receive JWT authentication token
- `GET /api/auth/profile` — Fetch organizer profile and active subscription

### Event Management
- `GET /api/events` — List organizer events
- `POST /api/events` — Create event (automatically generates Ed25519 keypair)
- `GET /api/events/:id` — Get event details and public key
- `PUT /api/events/:id` — Update event details or capacity
- `GET /api/events/:id/stats` — Live attendance and check-in velocity statistics

### Guest Roster & Ticket Dispatch
- `GET /api/events/:id/guests` — List all registered guests
- `POST /api/events/:id/guests` — Add individual guest
- `POST /api/events/:id/guests/bulk` — Upload CSV/Excel guest list with tier tags
- `POST /api/events/:id/tickets/dispatch` — Trigger multi-channel dispatch (WhatsApp / Email / SMS)
- `GET /api/tickets/:id/pass` — Public endpoint to render mobile pass with Apple Wallet download

### Gate Scanner & Verification API
- `POST /api/scanner/auth` — Authenticate gate scanner device via Event PIN code
- `GET /api/scanner/event/:id/manifest` — Download event public key & offline guest snapshot
- `POST /api/scan/verify` — Online check-in endpoint with Redis atomic lock
- `POST /api/scan/sync` — Batch sync queued offline check-in logs upon reconnection

### Real-Time Live Feed (WebSocket)
- `WS /ws/events/:id/live` — Bi-directional stream emitting live check-in events, gate velocity, and capacity alerts to organizer dashboards.

---

## 📂 Project Directory Structure

```text
Q_invite/
├── README.md                      # Comprehensive Architecture & Developer Guide
├── client/                        # Organizer Portal & Live Analytics (React 19 + Vite)
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navbar.jsx         # Global top navigation & notification center trigger
│   │   │   ├── Notification.jsx   # Universal notification dropdown & toast engine
│   │   │   ├── Footer.jsx         # Clean institutional/brand footer
│   │   │   ├── Sidebar.jsx        # Navigation drawer for organizer dashboards
│   │   │   └── scanner/           # Dedicated optical camera & verification module
│   │   ├── pages/                 # Application views
│   │   │   ├── Home.jsx           # Landing / Dashboard Overview
│   │   │   ├── EventsPage.jsx     # Event creation & management
│   │   │   ├── GuestsPage.jsx     # Bulk CSV guest upload & tier tagging
│   │   │   ├── LiveGatesPage.jsx  # Real-time velocity & gate telemetry
│   │   │   ├── ScannerPage.jsx    # Gate scanner interface (PWA-ready)
│   │   │   └── NotFoundPage.jsx   # 404 handler
│   │   ├── context/               # Auth & Event State contexts
│   │   └── utils/                 # QR generator, crypto helpers, CSV parsers
│   └── public/                    # Assets & audio cues (success_chime.mp3, error_buzz.mp3)
├── server/                        # Backend REST & WebSocket Services (Node.js)
│   ├── config/                    # DB (MongoDB/PostgreSQL) & Redis connection
│   ├── controllers/               # Event, Guest, Ticket, Scanner controllers
│   ├── middleware/                # Auth (JWT/PIN), RateLimiting, Validation, Error Handler
│   ├── models/                    # Event, Guest, Ticket, CheckInLog, User schemas
│   ├── routes/                    # API routes (/api/events, /api/guests, /api/scan, etc.)
│   ├── services/                  # Ed25519 Crypto, WhatsApp API, Resend Email, Redis Lock
│   └── index.js                   # Server entry point & WebSocket server
└── shared/                        # Shared types and cryptographic token specs
```

---

## 🛠️ Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Admin Portal Frontend** | React 19, Vite, Tailwind CSS | Fast compilation, modern typography, glassmorphism, responsive across desktop & mobile. |
| **Gate Scanner** | PWA, HTML5 Barcode Detection API, IndexedDB | Direct optical camera access, sub-100ms local verification, zero-install gate deployment. |
| **Audio Feedback** | Web Audio API / Synthesized Tones | Instant 880 Hz success chime and 180 Hz error buzz without relying on heavy external audio assets. |
| **Backend API** | Node.js (Express / Fastify) | High concurrent throughput for scan requests and WebSocket broadcasting. |
| **Cryptography** | `@noble/ed25519` / Node.js `crypto` | Constant-time asymmetric Ed25519 signature generation and local verification. |
| **Data Storage** | PostgreSQL / MongoDB | ACID transactions with atomic status updates (`SET status='CHECKED_IN'`). |
| **Cache & Concurrency** | Redis | Atomic locks (`SET ticket:lock:{id} NX EX 5`) guaranteeing zero duplicate admissions. |
| **Message Queues** | BullMQ | Asynchronous rate-limited queue workers for bulk WhatsApp and Email dispatch. |

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn
- Redis server (local or Docker / Redis Cloud)
- MongoDB or PostgreSQL instance

### 2. Installation

Clone and install dependencies for both client and server:

```bash
# In project root
git clone https://github.com/Ennytech1/TemplateProject_start.git .

# Install Client Dependencies
cd client
npm install

# Install Server Dependencies
cd ../server
npm install
```

### 3. Environment Variables

Create `.env` inside `server/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/qrinvite
# OR DATABASE_URL for Postgres
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key_here
ED25519_MASTER_SECRET=your_aes_master_secret_here

# Messaging (Optional for local testing)
WHATSAPP_API_TOKEN=your_whatsapp_token
RESEND_API_KEY=your_resend_api_key
```

Create `.env` inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
```

### 4. Running the Development Servers

```bash
# Start Backend Server (runs on http://localhost:5000)
cd server
npm run dev

# Start Frontend Client (runs on http://localhost:5173)
cd ../client
npm run dev
```

---

## 🗺️ Milestones & Roadmap

- [x] **Milestone 0: Architecture & Foundation Clean-Up**
  - Project directory clean-up and restructuring.
  - Reusable layout components (Navbar, Notification system, Toast engine, Footer).
  - Architecture blueprint and technical documentation.
- [ ] **Milestone 1: Cryptographic Engine & Guest Management**
  - Event model with automatic Ed25519 keypair generation.
  - Bulk CSV guest list ingestion with tier tagging (VIP, Regular, etc.).
  - Ticket token generator with compact Base64URL signed QR payloads.
- [ ] **Milestone 2: Gate Scanner PWA & Anti-Replay Concurrency Lock**
  - Optical camera scanner interface with Web Audio API chime/buzz.
  - Redis atomic lock (`SET NX EX 5`) to prevent double-spend attacks.
  - IndexedDB offline roster cache and background synchronization queue.
- [ ] **Milestone 3: Automated Multi-Channel Dispatch & Live Gate Telemetry**
  - Automated WhatsApp Cloud API & Email delivery with personalized pass cards.
  - Real-time WebSocket live gate monitoring (velocity, arrival peaks, capacity gauge).
  - Post-event CSV audit exports and attendance reports.

---

© 2026 QRInvite Platform. All rights reserved. Built for secure, tamper-resistant access control.
