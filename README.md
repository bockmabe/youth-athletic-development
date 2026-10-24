# Youth Athletic Development — session guide

A mobile-first, single-page guide to one 20–25 minute movement session for growing young athletes:
acceleration, coordination, single-leg stability and controlled stopping. Twice a week, on
non-consecutive days.

**Live:** https://bockmabe.github.io/youth-athletic-development/

- 9 exercises, each with an inline demo video, dose, coaching cues, common errors and a checkbox.
- Progress is saved on your device only (`localStorage`). No accounts, tracking or backend.
- Videos load only when you open an exercise, via YouTube's privacy-enhanced (`youtube-nocookie.com`)
  player, with a **Watch on YouTube** link as a fallback.

## Layout
| Path | What |
|---|---|
| `docs/` | The whole site (published by GitHub Pages from `main` → `/docs`). Plain HTML/CSS/JS. |
| `SPEC.md` | Program and requirements |
| `VIDEOS.md` | Which videos, why, and the evidence that they exist, match and embed |
| `TESTING.md` | Automated test results and known limitations |
| `tests/` | Development-only browser checks (not deployed, not loaded by the site) |

## Run locally
```sh
cd docs && python3 -m http.server 8000   # then open http://127.0.0.1:8000
```

## Disclaimer
General education, not medical advice. Stop for pain and see a clinician for persistent symptoms.
Videos belong to their creators and are embedded from YouTube.
