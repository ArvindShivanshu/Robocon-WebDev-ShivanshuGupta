# Deployment Guide (Vercel)

Deploy a live placeholder page within the first 20 minutes of the sprint so the team has a permanent preview URL.

---

## 20-Minute Quick Deploy Checklist

1. Log in to [vercel.com](https://vercel.com) using your GitHub account.
2. From the Vercel Dashboard, click the blue button **"Add New..."** in the top right, then select **"Project"**.
3. Locate your GitHub repository (`Robocon-WebDev-ShivanshuGupta` or your CAD workshop repo) and click **"Import"**.
4. In the Project Configuration screen:
   - **Project Name**: `cad-codesign-workshop`
   - **Framework Preset**: Select `Vite`.
   - **Root Directory**: Click "Edit", select `workshop-cad/client` (or `client` depending on your root), and click "Continue".
   - **Build Command**: Leave as default (`npm run build`).
   - **Output Directory**: Leave as default (`dist`).
5. **Environment Variables**:
   - See [SECRETS.md](file:///Users/shivanshugupta/Robocon-WebDev-ShivanshuGupta/workshop-cad/docs/SECRETS.md) for full instructions on configuring `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_URL`.
6. Click the blue **"Deploy"** button.
7. Wait ~60 seconds for the build to finish. Once the confetti animation plays, copy the public `.vercel.app` URL and post it in `state/LOG.md`.
