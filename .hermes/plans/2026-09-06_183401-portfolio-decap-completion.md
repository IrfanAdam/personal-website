# Personal Website — Portfolio Clone Completion Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Finish the Framer → self-hosted portfolio clone so the owner can edit all 14 case studies via a locked `/admin` and deploy to production with no database.

**Architecture:** Static Vite site (`public/` + `src/`). Content lives in `content/*.json` (14 `content/projects/*.json` + `content/settings.json`) loaded via `import.meta.glob` in `src/data/site.js`. Hash router in `src/main.js` → 4 views (`home`, `masonry`, `project`, `contact`). Decap CMS (`public/admin/`) with GitHub backend + `local_backend: true` for local edits via `decap-server`. No Supabase — static files + Git history are the DB.

**Tech Stack:** Vite 5, vanilla JS, `marked` for markdown, `decap-server` + `concurrently` for local CMS, GitHub OAuth for prod lock.

---

## Current context / assumptions

**Done:**
- Vite scaffold, hash router (`#/`, `#/masonry`, `#/projects/:slug`, `#/contact`), masonry grid (columns + filter), case grid (left copy / right media, stacks at 800px), contact/about blocks.
- All 14 projects exist in `content/projects/*.json` with correct slug/title/catA/catB/date/timeline/role/tag/image; `content/settings.json` has about + contact hero/bios + 6 socials.
- `public/images/` (14) + `public/icons/` (16) present, served correctly.
- Decap starter: `public/admin/index.html` loads decap-cms 3, `public/admin/config.yml` (github + local_backend + editorial_workflow + 2 collections), `src/data/site.js` imports JSON, `project.js` renders `body` via `marked`. `vite.config.js` fixes `/admin/` → `/admin/index.html`. `package.json` has `marked`, `decap-server`, `concurrently`, scripts `cms` / `cms:dev`. Build passes (29 modules, ~57k JS gzip ~18k).

**Assumed constraints:**
- Single editor (owner only) — no visitor writes, no DB needed.
- Framer source `https://irfanadam.framer.website/masonry` is canonical; image URLs already localized where possible.
- Host will be Netlify or Vercel (static `dist/`).
- User is on macOS, folder `/Users/irfan/Documents/Portfolio Redo/personal_website`, already `git init` but no remote.

**Open question answered:** Decap admin is not public signup — access = GitHub repo collaborators (or Netlify Identity invite). No Supabase until visitor writes exist.

---

### Task 1: Lock down config.yml repo + verify build

**Objective:** Replace placeholder repo and ensure config validates.

**Files:**
- Modify: `public/admin/config.yml:2-5`
- Test: `dist/admin/config.yml` after build

**Step 1: Update repo placeholder**

```yaml
backend:
  name: github
  repo: irfanadam/personal-website   # <- ask user for actual GitHub username/repo at start
  branch: main
```

**Step 2: Verify build copies config**

Run: `npm run build 2>&1 | tail -n 8`
Expected: `✓ built in ...` with `dist/admin/config.yml` containing `repo: irfanadam/...`

**Step 3: Commit**

```bash
git add public/admin/config.yml
git commit -m "chore: set decap repo"
```

---

### Task 2: Finish Site Settings collection validation

**Objective:** Ensure About/Contact/Socials edit cleanly in Decap.

**Files:**
- Modify: `content/settings.json` (keep as file collection)
- Modify: `public/admin/config.yml:collections.settings`
- Test: `src/data/site.js` handles missing fields

**Step 1: Add guard in site.js**

```js
export const socials = (settings.socials || []).map(s => [s.name, s.url]);
export const about = settings.about || '';
export const contact = settings.contact || { hero: [], now: '', past: '', bio2: '', wip: '', quote: '' };
```

**Step 2: Test in admin locally**

Run: `npm run cms:dev` (in one terminal), open `http://localhost:5173/admin/` → Settings → change About → Publish → check `content/settings.json` diff.

**Step 3: Build**

Run: `npm run build` — expect no missing-field crash.

**Step 4: Commit**

---

### Task 3: Projects collection — add missing Framer details

**Objective:** Ensure every project has editable spec + media that matches Framer detail pages (date/timeline/role/deliverables/platform).

**Files:**
- Modify: `public/admin/config.yml:collections.projects.fields` — add `deliverables`, `platform` optional string fields if needed
- Modify: `content/projects/*.json` — backfill empty `timeline`/`role` with `—` or real data if owner provides
- Modify: `src/data/site.js` — expose new fields
- Modify: `src/views/project.js` — render new spec rows

**Step 1: Extend fields**

```yaml
- { label: "Deliverables", name: "deliverables", widget: "string", required: false }
- { label: "Platform", name: "platform", widget: "string", required: false }
```

**Step 2: Update site.js mapping**

```js
export const projects = items.map(p => [p.slug, p.title, p.catA||'', p.catB||'', p.date, p.timeline, p.role, p.tag, p.image, p.deliverables||'—', p.platform||'—']);
```

**Step 3: Update project.js spec**

```html
<dl class="spec"><div><dt>Deliverables</dt><dd>${deliverables}</dd></div>...<div><dt>Platform</dt><dd>${platform}</dd></div></dl>
```

**Step 4: Verify**

Run: `npm run build`; manual check `#/projects/tas-51` shows spec.

**Step 5: Commit**

---

### Task 4: Body markdown — polish prose + image uploads

**Objective:** Confirm markdown body renders headings/lists/links/images with upload to `/images`.

**Files:**
- Modify: `src/styles/pages.css:.prose` (already present, tune if needed)
- Test: `content/projects/tas-51.json` with sample markdown

**Step 1: Insert sample body (local test only)**

```json
"body": "## Challenge\n\nSynapse had fragmented sales...\n\n![mock](/images/tas-51.jpg)"
```

**Step 2: Run dev and inspect**

Run: `npm run dev -- --host 0.0.0.0 --port 5173` → open `#/projects/tas-51` → verify `.prose` styles, image loads.

**Step 3: Revert sample**

**Step 4: Confirm upload path**

In Decap, upload image for a project → check `public/images/` gets file and `image` field is `/images/<name>.jpg`.

**Step 5: Commit CSS if tuned**

---

### Task 5: Admin local dev ergonomics

**Objective:** Make local editing one command and fix `/admin/` serving.

**Files:**
- Verify: `vite.config.js` admin-serve plugin already maps `/admin` → `/admin/index.html`
- Modify: `package.json:scripts` — keep `cms:dev` as `concurrently "vite --host 0.0.0.0 --port 5173" "decap-server"`
- Test: both servers start

**Step 1: Test concurrently**

Run: `npm run cms:dev` → expect two logs: `Vite...` and `Decap Server...` ; curl `http://localhost:5173/admin/` → 200 with `<title>Admin`, curl `http://localhost:8081/api/v1` → 200.

**Step 2: Document**

Update `README.md` with `npm run cms:dev` usage.

**Step 3: Commit**

---

### Task 6: Create GitHub remote + initial push

**Objective:** Repo exists so Decap GitHub backend can authenticate.

**Files:**
- None (git)

**Step 1: Create repo on GitHub (user does via gh or UI)**

```bash
gh repo create personal-website --public --source=. --remote=origin --push
# or if manual:
git remote add origin https://github.com/<user>/personal-website.git
git add .
git commit -m "feat: initial portfolio clone with decap cms"
git push -u origin main
```

**Step 2: Verify**

`git remote -v` shows origin, GitHub shows `content/` + `public/admin/config.yml`.

**Step 3: Update `config.yml` repo if username differs, rebuild, push again**

---

### Task 7: Deploy static build + wire auth

**Objective:** `dist/` live with locked `/admin`.

**Option A — Netlify (simplest lock):**
- Drag `dist` or connect repo, build command `npm run build`, publish dir `dist`
- In Netlify: Enable Identity → Invite only owner email → Enable Git Gateway → in `config.yml` switch to `backend: name: git-gateway` (or keep github + OAuth via Netlify)
- Test: `https://<site>/admin` → login with invited email, edit project, publish → auto-commit → rebuild

**Option B — Vercel/Cloudflare + GitHub OAuth:**
- Keep `backend: name: github`, create GitHub OAuth App (callback `https://<site>/.netlify/...` or use `https://decap-oauth...`), set `site_domain` in Netlify or run `decap-oauth-provider`

**Files:**
- Modify: `public/admin/config.yml:backend` only if switching to `git-gateway`

**Step 1: Deploy**

Run: `npm run build` → deploy `dist`

**Step 2: Verify**

Open `https://<site>/admin` → login succeeds only for owner, edit → check commit appears in GitHub, site rebuilds.

**Step 3: Commit config change if any**

---

### Task 8: Final QA checklist

**Objective:** No broken routes or missing images.

**Files:**
- Test: all routes

**Step 1: Run build + preview**

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 5199 &
curl -s http://localhost:5199/ | grep -q "Working on stories" && echo "home ok"
curl -s http://localhost:5199/admin/config.yml | grep -q "collections" && echo "admin ok"
ls dist/images | wc -l   # expect 14
ls dist/icons | wc -l    # expect 16
```

**Step 2: Click through in browser:** `#/`, `#/masonry` (filter + cols), each `#/projects/<slug>` (14), `#/contact` — check left copy / right media, footer socials.

**Step 3: Mobile check:** use Network URL `http://10.20.15.69:5173/` on phone same Wi-Fi.

**Step 4: Fix any failures, commit**

---

## Files likely to change

- `public/admin/config.yml` (repo, backend, fields)
- `public/admin/index.html` (no change unless CSP needed)
- `content/settings.json`, `content/projects/*.json` (content)
- `src/data/site.js` (field mapping + guards)
- `src/views/project.js` (spec + markdown render)
- `src/styles/pages.css` (prose)
- `vite.config.js` (admin route, already done)
- `package.json` (scripts, already done)
- `README.md` (docs for `cms:dev` and deploy)

## Tests / validation (repeat after each task)

- `npm run build` — must pass, no `vite` errors
- `curl http://localhost:5173/` 200, `curl http://localhost:5173/admin/` 200 contains `decap-cms`
- Manual: masonry filters, project next chaining, contact page
- Admin: local edit via `npm run cms:dev` persists to `content/*.json` and survives rebuild

## Risks, tradeoffs, and open questions

- **Risk:** GitHub OAuth setup varies by host — prefer Netlify Identity + `git-gateway` if user picks Netlify to avoid custom OAuth server. Keep `local_backend: true` always so local edits never block on OAuth.
- **Risk:** `public/images` grows — add `git lfs` only if images exceed 50MB total (currently ~2MB each). Don't pre-optimize.
- **Tradeoff:** No DB means instant, cheap, versioned edits but no draft previews without `editorial_workflow` PRs — acceptable for single editor.
- **Open:** Final GitHub username/repo name — placeholder `<YOUR_GITHUB_USERNAME>/personal-website` must be replaced before prod login works.
- **Open:** Whether to add `deliverables`/`platform` fields — add only if owner wants them editable; otherwise keep `—` placeholder.
- **Open:** Hosting choice — Netlify vs Vercel vs Cloudflare Pages — determines auth wiring; document both but implement chosen one.

