# VIDEOS — provenance and evidence

All checks were run on 2026-10-24. YouTube can change embedding, availability or ads at any time,
so treat this as a dated snapshot and re-run `tests/player-checks.js` when in doubt.

## The 9 videos

| # | Exercise | Video title (as published) | Channel | Watch URL | Length |
|---|---|---|---|---|---|
| 1 | A-march | Sprint Drills : A-March, Variations, & Teaching Points | Brendan Thompson -- Speed & Physical Therapy | https://www.youtube.com/watch?v=zeQ_vRyB35Q | 3:22 |
| 2 | A-skip | Sprint Drills : A-Skip & A-Run | Brendan Thompson -- Speed & Physical Therapy | https://www.youtube.com/watch?v=tTOnOCHlBNI | 2:18 |
| 3 | Split squat | Split Squat (Upright) | E3 Rehab Exercise Library | https://www.youtube.com/watch?v=U7fM_XEC0mM | 0:13 |
| 4 | Single-leg Romanian deadlift | Single Leg RDL | E3 Rehab Exercise Library | https://www.youtube.com/watch?v=YKVi-BsdKw4 | 0:20 |
| 5 | Calf raises | Heel Raise | E3 Rehab Exercise Library | https://www.youtube.com/watch?v=zvZp4FJjME4 | 0:20 |
| 6 | Side plank | Core Exercise: Side Plank | Children's Hospital Colorado | https://www.youtube.com/watch?v=N_s9em1xTqU | 1:10 |
| 7 | Small hop and stick | Single Leg Hop and Stick | Streamline Performance Physical Therapy | https://www.youtube.com/watch?v=-YypsmQZpqY | 0:20 |
| 8 | 10-meter accelerations | SprintFIT: Acceleration | ALTIS World | https://www.youtube.com/watch?v=XGnRUc7jxDA | 0:31 |
| 9 | Run and controlled stop | Acceleration and Deceleration | E3 Rehab Exercise Library | https://www.youtube.com/watch?v=Alzv_xogZr8 | 0:17 |

Embeds use `https://www.youtube-nocookie.com/embed/<ID>?rel=0&playsinline=1&modestbranding=1`.

## Why these
Preference order was ALTIS / E3 Rehab / credible sprint, PT and S&C instructors. ALTIS has no public
A-march or A-skip demo on YouTube, so the warm-up drills use Brendan Thompson (a physical therapist
and sprint coach whose work also appears on ALTIS Connect). Side plank uses Children's Hospital
Colorado's pediatric spine program, which suits a youth audience. Short E3 Rehab library clips were
chosen over long explainers so they're usable mid-session on a phone. Hop-and-stick uses a PT clinic
demo whose on-screen caption ("stick the landing and hold until you gain total control before
stepping down") matches the prescribed drill.

## Evidence per layer (all 9 unless noted)

| Layer | What was checked | Result |
|---|---|---|
| Exists / identity | Watch page `ytInitialPlayerResponse`: `videoDetails.title`, `author`, `lengthSeconds` | Title, channel and length match the table for all 9 |
| Content matches exercise | Visual review of YouTube's three mid-video frame stills (`hq1/hq2/hq3.jpg`) for each video, plus description text | All 9 show the named exercise. #1–2: athlete performing A-march / A-skip on a track. #3: bodyweight upright split squat. #4: bodyweight single-leg RDL. #5: two-leg heel raise with light chair support. #6: side plank (pediatric hospital). #7: single-leg hop and stick with caption. #8: 2- and 3-point start accelerations. #9: run into a decelerated stop on grass |
| Not just oEmbed | `playabilityStatus.status` and `playabilityStatus.playableInEmbed` from the watch page | `OK` and `playableInEmbed: true` for all 9; `isFamilySafe: true` for all 9. (oEmbed also returns 200, but that alone does not prove embeddability.) |
| Fallback link | `GET https://www.youtube.com/watch?v=<ID>` | HTTP 200 for all 9 |
| Iframe HTTP response at the deployed HTTPS URL | Playwright, Chromium, live GitHub Pages page: response for the `youtube-nocookie.com/embed/<ID>` document | HTTP 200 for all 9; the request carried `Referer: https://bockmabe.github.io/` (the HTTPS Referer that prevents Error 153) |
| Playable state in automation | Pressed the in-player "Play video" button, waited 7 s, read the `<video>` element | All 9: `paused: false`, `readyState: 4`, `currentTime` ≈ 6.2–6.6 s, no `.ytp-error`, no "Sign in to confirm" prompt |
| Ads | `.ad-showing` on the player | #6 and #8 played a 15 s skippable pre-roll ad in this run. After skipping it, the main video played (`duration` 70 s / 31.1 s, matching the content, `paused: false`) |
| Physical iPhone playback | — | **Not verified.** No physical iPhone was available to this run. See `TESTING.md` |

## Limitations
- "Playable" above means desktop Chromium driven by Playwright in its own persistent profile (not a
  signed-in everyday browser). Mobile Safari, iOS Lockdown Mode, content blockers, network filters
  or YouTube policy changes can behave differently.
- YouTube can serve ads inside embeds, including to young viewers; the site has no control over that.
- Content match is a visual check of three stills plus the description, not a frame-by-frame review.
  Video 2 also shows the A-run after the A-skip, and the credit line says so.
- Video IDs were taken from YouTube's own results and watch pages; none were invented.
