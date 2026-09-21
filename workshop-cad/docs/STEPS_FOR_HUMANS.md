# Plain Language Steps for Humans

Welcome! This guide explains how to work with your AI agent team to build the CAD Co-Design project. Follow these numbered steps in order.

---

### 1. Opening the Folder & Your First Agent Message
Open the project folder in VS Code or your editor. Start a new chat with your AI agent and paste this exact message (replace `<your-lane>` with `surface`, `core`, or `glue`):

> "Read `/start.md` and `/agents/<your-lane>.md`. Confirm your lane, verify you have created `.env.local` and added it to `.gitignore`, and report ready."

---

### 2. Running a Second Agent
If you run two agents at once, give the second agent a different lane (e.g., one on `surface` for UI and one on `core` for backend API). **Strict rule:** Only one of your agents is allowed to push code to GitHub at any time. When one finishes pushing, the other may push.

---

### 3. Claiming a Task in TASK_BOARD.md
Open `/docs/TASK_BOARD.md`. Find an unclaimed task for your lane with status `Not Started`. Edit only your task row to set status to `In Progress`. In GitHub Desktop, write the commit summary `claim: <ID>` (e.g., `claim: SURF-01`), commit, and immediately click "Push origin". If GitHub rejects your push because someone else pushed first, pull origin and pick another open task.

---

### 4. Saving and Sharing Code (GitHub Desktop)
Use GitHub Desktop buttons instead of command line (Glue lane may use the terminal):
1. Review the changed files in the left sidebar to confirm they are inside your lane.
2. In the bottom-left box, enter a short description (e.g., `feat(surface): add 3D canvas viewer`).
3. Click the blue **"Commit to feat/..."** button.
4. Click the top-right button **"Push origin"**.

---

### 5. Updating Your State File
Whenever you start, finish, or get blocked on work, update `/state/<your-lane>.md`. Fill in the single line:
`Status: In Progress | Doing now: Task description | Blocked by: None | Last commit: your commit title`
Only edit your own lane's state file.

---

### 6. What to Say When You Are Stuck
If anything breaks, fails to build, or you do not understand the error, copy and paste this exact prompt to your agent:

> "Explain what just happened in plain English and tell me exactly what to click or type next."

---

### 7. What NOT to Do (Golden Guardrails)
- **Never paste API keys or passwords** into any chat or comment where others can see them.
- **Never edit files outside your lane** (Surface stays in `client/`, Core stays in `server/`).
- **Never force-push** to GitHub or overwrite anyone else's branch.

---

### 8. Team Sync Points
Every 60 minutes, the team stops for a 3-minute sync check:
- **T+60 min**: Report your placeholder deployment status and local dev server setup.
- **T+120 min**: Report CAD canvas rendering and backend API database connectivity.
- **T+180 min**: Report end-to-end registration flow test from UI through database.
- **T+240 min**: Feature freeze! Rehearse the live demo and record backup video.

At each sync point, state: (1) what works, (2) what is blocked, and (3) what you will finish in the next hour.

---

### 9. If You Are the Coordinator
If you are the Coordinator (Glue lane leader), **your job is NOT writing application code**. Your responsibilities are:
- Keeping `/docs/TASK_BOARD.md` accurate and up to date.
- Calling out the countdown timer and organizing the T+60/120/180/240 syncs.
- Reviewing and rehearsing the demo script in `/docs/DEMO.md` so the team delivers a flawless showcase.
