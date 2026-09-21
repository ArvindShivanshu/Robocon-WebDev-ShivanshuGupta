# CAD Co-Design Project Plan

A full-stack PERN platform for the SolidWorks 3D CAD & Altium ECAD Co-Design Workshop with real-time seat reservations and an interactive engineering canvas.

---

## 1. Overview & Objectives
- **Target Audience**: Mechanical engineers, PCB designers, and mechatronics students.
- **Core Value**: Learn enclosure-to-board co-design, view 3D assemblies, route 45° PCB traces interactively in the browser, and secure verified workshop seats.
- **Timeline**: 4-hour build & integration sprint with 60-minute sync gates.

---

## 2. System Architecture
```
[Client: React 18 + Vite + Lucide + Canvas-Confetti]
           │
           │ HTTP / JSON API
           ▼
[Server: Node.js + Express + CORS + Connection Pool]
           │
           │ PostgreSQL Driver (pg)
           ▼
[Database: PostgreSQL / Supabase Relational Tables]
```

- **Frontend (`client/`)**: Modular React components, sleek dark mode theme, interactive HTML5/SVG canvas for ECAD/CAD rendering.
- **Backend (`server/`)**: Express REST endpoints with parameterized queries and transactional seat locking.
- **Data Store**: Supabase-hosted PostgreSQL with foreign keys and unique constraints.

---

## 3. Database Schema

### Table: `workshops`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Unique workshop identifier |
| `slug` | VARCHAR(50) | UNIQUE, NOT NULL | URL-friendly key (`workshopreg2`) |
| `title` | VARCHAR(255) | NOT NULL | Workshop name |
| `subtitle` | TEXT | | Brief overview |
| `event_date` | VARCHAR(100) | | Scheduled dates |
| `location` | VARCHAR(150) | | Physical lab and stream link |
| `total_lab_seats` | INTEGER | NOT NULL | Maximum lab capacity |
| `booked_lab_seats` | INTEGER | NOT NULL | Current registered seats |
| `solidworks_seats_left`| INTEGER | NOT NULL | Remaining SolidWorks track seats |
| `altium_seats_left` | INTEGER | NOT NULL | Remaining Altium track seats |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

### Table: `registrations`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Internal registration ID |
| `registration_id` | VARCHAR(30) | UNIQUE, NOT NULL | Public ticket code (`REG-CAD-XXXX`) |
| `full_name` | VARCHAR(150) | NOT NULL | Attendee full name |
| `email` | VARCHAR(180) | NOT NULL | Attendee contact email |
| `phone` | VARCHAR(50) | | Contact phone number |
| `institution` | VARCHAR(180) | NOT NULL | College or company name |
| `reg_number` | VARCHAR(80) | | Student / employee ID |
| `department` | VARCHAR(100) | NOT NULL | Engineering discipline |
| `year_or_role` | VARCHAR(60) | NOT NULL | Year of study or job title |
| `track` | VARCHAR(50) | NOT NULL | `solidworks`, `altium`, or `both_mechatronics` |
| `attendance_mode`| VARCHAR(50) | DEFAULT 'in_person'| `in_person` or `virtual` |
| `experience_level`| VARCHAR(50) | DEFAULT 'Intermediate'| Skill level assessment |
| `license_assistance`| BOOLEAN | DEFAULT TRUE | Student license help flag |
| `project_interest`| TEXT | | Description of build idea |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Registration timestamp |

---

## 4. API Endpoints
- `GET /api/workshops`: Returns workshop details, dates, and live remaining seat counts.
- `POST /api/register`: Validates input payload, verifies seat availability, executes transactional INSERT + seat decrement, and returns confirmation pass.
- `GET /api/health`: Healthcheck endpoint for uptime monitoring and Vercel keepalive.

---

## 5. UI Plan & Component Breakdown
1. **Hero & Stats Bar**: Workshop title, countdown timer, live seat gauges for both CAD & ECAD tracks.
2. **Interactive CAD Studio**:
   - **SolidWorks 3D Enclosure**: Wireframe/shaded preview, dimensional tolerance annotations.
   - **Altium ECAD Canvas**: Interactive PCB layout, component dragging, 45° copper trace routing, live DRC clearance checking, and layer stackup manager (`L1_TOP`, `L2_GND`, `L3_PWR`, `L12_BOT`).
3. **Registration Form**: Controlled inputs, track selector, validation indicators, and submit button.
4. **Pass Modal & Celebration**: Digital badge with ticket code, QR code placeholder, and confetti trigger.
