# CAD Project Team Workflow & Branching Strategy

This document establishes the collaboration rules for human engineers and AI agents across all lanes.

---

## 1. Branch Naming Convention
Every branch must strictly adhere to the naming format:
`feat/<lane>/<task-id>`

Examples:
- `feat/surface/SURF-01`
- `feat/core/CORE-02`
- `feat/glue/GLUE-01`

---

## 2. 45-Minute Cadence & Merging Rules
- **Merge every 45 minutes maximum**: Even if a feature is partially complete, push the working slice and merge to `main`.
- **Only Glue merges to `main`**: Surface and Core agents create Pull Requests or signal Glue to merge. Never merge directly to `main` from Surface or Core.
- **Single-Agent Push Rule**: Only one agent per human may push to GitHub at any given moment to prevent accidental branch thrashing.

---

## 3. Folder Ownership Table

| Lane | Owned Folders & Files | Read-Only / Do NOT Touch |
|---|---|---|
| **Surface** | `client/` (`client/src/`, `client/public/`, `client/index.html`, `client/vite.config.js`), `/state/surface.md` | `server/`, `/state/core.md`, `/state/glue.md`, database migrations |
| **Core** | `server/` (`server/routes/`, `server/controllers/`, `server/db/`, `server/config/`), `/state/core.md` | `client/`, `/state/surface.md`, `/state/glue.md`, frontend styles |
| **Glue** | Root configs, `docs/`, `/state/LOG.md`, `/state/glue.md`, deployment manifests, `.github/` | Does not edit UI components or DB queries directly unless integrating |

---

## 4. Merge Conflict Resolution Protocol
- If a merge conflict arises when merging into `main`, the owner of the incoming branch has **10 minutes** to resolve it cleanly.
- If the conflict cannot be resolved within 10 minutes, the merge is immediately **reverted** to keep the `main` branch green and stable.
- The lane owner must pull the latest `main`, rebase locally, fix the conflict, and re-request merge.
