# HANDOFF — 2026-10-24

**Live:** https://bockmabe.github.io/youth-athletic-development/ (HTTPS 200)
**Repo:** https://github.com/bockmabe/youth-athletic-development (public; Pages from `main` → `/docs`, no Actions)

## Done
- Static, mobile-first single page (`docs/`) covering the exact 9-exercise program in `SPEC.md`. Each
  exercise has native details/summary, a lazy `youtube-nocookie` iframe with
  `referrerpolicy=strict-origin-when-cross-origin`, a Watch on YouTube fallback, dose, cues, common errors
  and a checkbox kept outside the summary. Includes `localStorage` progress, reset, a blocked-storage
  notice, and a safety section with primary sources. Light and dark mode.
- 9 real videos researched and verified. Evidence and limitations are in `VIDEOS.md`.
- Automated tests: 65/65 functional checks pass locally and live. On the live page, all 9 iframes return
  HTTP 200 with an HTTPS Referer and play in automated Chromium (`TESTING.md`).

## Not done / needs a human
- **Physical iPhone playback is not verified.** Run the 4-step manual check at the bottom of `TESTING.md`.
- Side plank and acceleration videos served 15 s skippable ads in testing. The only alternative would
  be swapping to channels without ads.

## Notes for the next agent
- Do not intensify the program or add progressions without the owner (`CLAUDE.md`).
- Public repo: keep identifying family details out.
