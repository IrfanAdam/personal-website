# Personal Website — Masonry clone
Clone of https://irfanadam.framer.website/masonry — static Vite site.
## Run
`npm install` then `npm run dev -- --host 0.0.0.0` (phone: Network URL).
## Edit
Add stories in `src/data/site.js` (slug, title, categories, date, timeline, role).
Put images in `public/images/`.
## Edit content (Decap CMS)
`npm run cms:dev` starts Vite (:5173) + decap-server (:8081) together.
Open `http://localhost:5173/admin/` → edit Projects / Site Settings → Publish.
Changes land in `content/` as JSON; rebuild to see them live.
Prod `/admin` uses the GitHub backend (`irfanadam/personal-website`) — needs
a GitHub OAuth app for Vercel; local edits always work via `local_backend`.
## Deploy (Vercel)
`npm run build` → `dist/` is ready for Vercel / Netlify / Cloudflare.
Vercel: import folder, framework Vite, output `dist`.
## DS conventions (standing — don't re-ask)
- Trackability: every DS scope gets `.hermes/plans/<date>-<scope>.md` with `## Phase N` anchors; every DS commit cites `[plan:<file>#phase-N]`; verify via `npm run ds:track` + `npm test`.
