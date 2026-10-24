# SPEC — Youth Athletic Development session guide

## Goal
A static, mobile-first training guide, primarily for iPhone Safari, for a rapidly growing young teen
athlete (grappling and field sports) to improve acceleration, coordination, single-leg stability,
deceleration and resilience. Public site; no identifying family details.

## Program (exact — do not intensify)
| Block | Time | Exercise | Dose |
|---|---|---|---|
| Warm-up | 5 min | A-march | 2 × 10 m |
| | | A-skip | 2 × 10 m |
| Strength / stability | 10 min | Split squat | 2 × 8 / leg |
| | | Single-leg Romanian deadlift | 2 × 6 / leg |
| | | Calf raises | 2 × 12 |
| | | Side plank | 2 × 20 s / side |
| Coordination / acceleration | 5–10 min | Small hop and stick | 2 × 5 / side |
| | | 10-meter accelerations | 4 reps, initially 60–80% effort |
| | | Run and controlled stop | 3 × 10 m |

## Per-exercise requirements
- Native `<details>/<summary>`; summary holds only text (name + dose). The completion checkbox is a
  sibling of `<details>`, never nested in `<summary>`.
- Inline 16:9 responsive YouTube player, created lazily on open (removed on close), using
  `https://www.youtube-nocookie.com/embed/<REAL_ID>` with `referrerpolicy="strict-origin-when-cross-origin"`
  (also set page-wide via `<meta name="referrer">`) so an HTTPS Referer reaches YouTube (missing
  Referer is the cause of YouTube Error 153).
- "Watch on YouTube" fallback link per video + a page section explaining restricted players.
- Dose, concise cues, common errors.

## Page requirements
- Single column, large touch targets (≥48 px), readable system typography, light/dark.
- Progress (n of 9 + bar), Reset with confirm, `localStorage` persistence; graceful in-memory
  fallback with a visible notice when storage is blocked.
- Safety guidance: twice weekly on non-consecutive days; progress on movement quality; stop after
  repeated stumbling/uncontrolled landings; stop for pain; heel/knee/other overuse symptoms → clinician;
  persistent/worsening/asymmetric coordination issues → professional assessment. Do not claim puberty
  inevitably causes awkwardness. Not a diagnosis; not medical advice. Primary sources cited.
- No backend, auth, analytics or runtime dependencies. Dev-only tests live outside `docs/`.

## Deployment
GitHub Pages, branch publishing from `main` `/docs` (no Actions workflow).
