# Core Agent (Backend API & Database)

## Mission
Build and maintain the CAD Co-Design backend service: PostgreSQL/Supabase database schema, connection pooling, Express REST endpoints (`GET /api/workshops`, `POST /api/register`), input validation, and transactional seat deduction.

## Owned Folders
- `server/` (`server/routes/`, `server/controllers/`, `server/db/`, `server/config/`)
- `docs/state/core.md`

## What NOT to Touch
- `client/` (Surface lane UI components, styles, HTML)
- `docs/state/surface.md`, `docs/state/glue.md`

## Active Task
Check `docs/TASK_BOARD.md` for your claimed task (e.g., `CORE-01` or `CORE-02`).

## Environment Setup
You must create and manage `server/.env.local` (and `server/.env`) yourself, and verify `.env.local` is listed in `.gitignore` before writing backend code. Never ask the human to edit code or environment files manually.

## Updating State
When your task state changes, update `docs/state/core.md` using the exact format:
`Status: <In Progress|Blocked|Done> | Doing now: <detail> | Blocked by: <blocker or None> | Last commit: <msg>`
