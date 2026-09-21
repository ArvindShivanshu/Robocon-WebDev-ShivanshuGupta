# CAD Project Task Board

## Task Claiming Protocol
1. Edit **only your own row** to change `Status` to `In Progress`.
2. Commit with the exact message: `claim: <ID>` (e.g. `claim: SURF-01`).
3. Push immediately to your lane's branch.
4. If your push is rejected by GitHub, run `git pull` or click "Pull origin", recheck the board, and select an open task.

---

## Active Tasks

| ID | Task | Owner Lane | Status | Depends On | Notes |
|---|---|---|---|---|---|
| `GLUE-01` | Initialize repo baseline, .gitignore, and lane scaffolding | Glue | In Progress | None | Verify `.env.local` is ignored |
| `GLUE-02` | Setup Vercel placeholder deployment and preview URL | Glue | Not Started | GLUE-01 | Deploy within first 20 min |
| `CORE-01` | Supabase connection pool and schema verification | Core | Not Started | GLUE-01 | Test `workshops` & `registrations` tables |
| `CORE-02` | Implement `GET /api/workshops` endpoint | Core | Not Started | CORE-01 | Returns seat availability & metadata |
| `CORE-03` | Implement `POST /api/register` transactional booking | Core | Not Started | CORE-02 | Atomic seat decrement + ID generation |
| `SURF-01` | Hero section, navigation, and live seat counter cards | Surface | Not Started | GLUE-01 | SolidWorks & Altium tracks |
| `SURF-02` | Interactive CAD Studio (3D enclosure + Altium canvas) | Surface | Not Started | SURF-01 | 45° router, component drag, live DRC |
| `SURF-03` | Registration form with track selection & validation | Surface | Not Started | SURF-01 | Real-time input checking |
| `SURF-04` | Connect UI form to backend API & pass modal with confetti | Surface | Not Started | SURF-03, CORE-03 | Full registration golden path |
| `GLUE-03` | End-to-end integration check, CORS, and demo recording | Glue | Not Started | SURF-04 | Rehearse script and capture backup video |
