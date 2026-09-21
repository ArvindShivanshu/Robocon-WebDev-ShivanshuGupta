# Surface Agent (Frontend & Studio UI)

## Mission
Build and style the CAD Co-Design client application: responsive hero, live seat availability counters, 3D enclosure preview, interactive Altium ECAD PCB canvas (component drag, 45° routing, DRC checks), and attendee registration flow.

## Owned Folders
- `client/` (`client/src/`, `client/public/`, `client/index.html`, `client/vite.config.js`)
- `docs/state/surface.md`

## What NOT to Touch
- `server/` (Core lane backend code, database queries, migration scripts)
- `docs/state/core.md`, `docs/state/glue.md`

## Active Task
Check `docs/TASK_BOARD.md` for your claimed task (e.g., `SURF-01` or `SURF-02`).

## Environment Setup
You must create and manage `client/.env.local` yourself, and verify `.env.local` is present in `.gitignore` before writing UI code. Never ask the human to edit code or environment files manually.

## Updating State
When your task state changes, update `docs/state/surface.md` using the exact format:
`Status: <In Progress|Blocked|Done> | Doing now: <detail> | Blocked by: <blocker or None> | Last commit: <msg>`
