# Secrets & Environment Variables Guide

This guide gives you exact, click-by-click instructions to set up database and hosting credentials safely.

> **CRITICAL RULE:**
> **Never type a real key into a chat message, a code file, or a commit. Only .env.local, which is git-ignored.**

---

## Agent Pre-Execution Requirement
Before writing any feature code or database logic, **every agent must create `.env.local` and add `.env.local` (as well as `.env`) to `.gitignore` FIRST**. The agent must explicitly confirm to the human: *"I have ensured .env.local and .env are in .gitignore before writing code."*

---

## 1. Supabase: Getting Project URL & API Keys

### Step 1: Create Your Supabase Project
1. Log in to [supabase.com/dashboard](https://supabase.com/dashboard).
2. Click the green button **"New project"**.
3. Select your organization.
4. Fill in:
   - **Name**: `cad-codesign-workshop`
   - **Database Password**: Click "Generate a password" and store it in your personal password manager.
   - **Region**: Choose the region closest to your users.
5. Click **"Create new project"** and wait ~2 minutes for the database to spin up.

### Step 2: Retrieve the Keys
1. In the left-hand sidebar menu, click the gear icon **"Project Settings"** (at the bottom).
2. Under the Project Settings menu, click **"API"**.
3. You will see three critical values:
   - **Project URL** (format: `https://xyzcompany.supabase.co`)
   - **anon / public key** (safe for browser client)
   - **service_role key** (secret backend admin key, never expose to client)

### Step 3: Which Key Goes Where?
- **In your frontend client (`client/.env.local`)**:
  ```env
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-public-key
  VITE_API_URL=http://localhost:5000
  ```
- **In your backend server (`server/.env.local` or `server/.env`)**:
  ```env
  PORT=5000
  DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
  SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
  ```

---

## 2. Vercel: Adding Environment Variables in the Dashboard

1. Open your browser to [vercel.com/dashboard](https://vercel.com/dashboard).
2. Click on your project card (`cad-codesign-workshop`).
3. In the top navigation tabs, click **"Settings"**.
4. In the left navigation menu, click **"Environment Variables"**.
5. Add each variable one by one:
   - **Key**: Enter the variable name (e.g., `VITE_SUPABASE_URL`, `DATABASE_URL`).
   - **Value**: Paste the exact secret value.
   - **Environments**: Check all three boxes: `Production`, `Preview`, and `Development`.
6. Click the blue **"Save"** button.
7. Repeat for each variable.
8. If your deployment was already running, go to the **"Deployments"** tab, click the three dots `...` next to the latest deployment, and click **"Redeploy"** to load the new environment variables.
