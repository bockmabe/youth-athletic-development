# Youth Athletic Development — agent brief

**What this is:** a polished, mobile-first (iPhone Safari first) static page that walks a growing young
teen athlete through one fixed 20–25 minute session — warm-up, strength/stability, coordination/
acceleration — twice a week. Each of the 9 exercises has an expandable card with an inline YouTube
demo, dose, cues, common errors and a completion checkbox saved in `localStorage`. No backend, no
accounts, no runtime dependencies.

## Start here
- Shared rules: `~/projects/be-agentic-v1/docs/conventions.md` (safety spine, routing, ledger).
- Live state (brain is source of truth — verify): `brain recall "youth-athletic-development status decisions open" -k 8`
  (subject `proj:youth-athletic-development`). Coordinators capture back; executors return
  sensitivity-tagged `CAPTURE-CANDIDATE` facts (`skills/project-loop.md`).

## Status (2026-10-24 — verify against the brain)
- v1 built, published and deployed: https://bockmabe.github.io/youth-athletic-development/
- Automated checks: 65/65 functional checks pass locally and live. On the live HTTPS page, all 9 embeds
  return 200 with an HTTPS Referer and reach playback in automated Chromium (`TESTING.md`).
- **Open:** playback on a physical iPhone Safari is not yet confirmed by a human (`TESTING.md` has a
  4-step manual check).

## Open decisions
- Whether to add a "progression" view later. Current rule: the program in `SPEC.md` is fixed;
  do not intensify it or add load/speed progressions without the owner.

## Key files
- `docs/` — the deployed site (`index.html`, `styles.css`, `app.js`). This is the entire runtime.
- `SPEC.md` — exact program and requirements. `VIDEOS.md` — video provenance and evidence.
- `TESTING.md` — exact automated results + limitations. `HANDOFF.md` — latest handoff.
- `tests/browser-checks.js` — dev-only Playwright checks (run via the Playwright MCP); not deployed.

## How to work here
- **Remote:** GitHub `bockmabe/youth-athletic-development` (**public**) — an explicit, owner-authorized
  exception to the self-hosted default because it is served by GitHub Pages (branch `main`, folder `/docs`).
- **Public repo hygiene:** no names, schools, locations, medical records or other identifying family
  details; no secrets, tokens, private prompts or transcripts.
- `git pull` before, commit + push after. Pushing to `main` redeploys the site.
- Check with the owner before any outward change of scope (new audiences, sharing, domains).
- Changing a video: follow the evidence bar in `VIDEOS.md` (real ID, content matches the exercise,
  `playableInEmbed`, live iframe check, Watch on YouTube fallback). Never invent IDs.
