# TESTING

Run date: 2026-10-24. Tooling: the Playwright MCP server in its own persistent browser profile
(desktop Chromium 156, user agent `Mozilla/5.0 (Macintosh; …) Chrome/156.0.0.0`), viewport 390×844
(iPhone 12–16 class) unless noted. No extension mode, no everyday browser session. The test scripts
in `tests/` are development-only and are not referenced by the site.

## 1. Functional suite — `tests/browser-checks.js`

| Target | Result |
|---|---|
| Local `http://127.0.0.1:8766/` (python `http.server` over `docs/`) | **65 / 65 passed** |
| Live `https://bockmabe.github.io/youth-athletic-development/` | **65 / 65 passed** |

Checks covered:
- 9 `<details>/<summary>` exercises and 9 completion checkboxes; **0** interactive elements nested inside any `<summary>`.
- **0** iframes at page load (lazy).
- Per exercise (×9): opening creates exactly one iframe with `src` = `https://www.youtube-nocookie.com/embed/<ID>?…`;
  `referrerpolicy` attribute and property both = `strict-origin-when-cross-origin`; player is 16:9;
  no horizontal overflow while open; closing collapses and removes the iframe.
- Page `<meta name="referrer">` = `strict-origin-when-cross-origin`.
- No horizontal overflow (`scrollWidth ≤ clientWidth`) at 320, 375, 390 and 430 px widths.
- Every "Watch on YouTube" link = `https://www.youtube.com/watch?v=<same ID>`, `target=_blank`.
- Checking 3 boxes → "3 of 9 done"; after reload the same 3 boxes are checked and the bar is 33.3%.
- Tapping a checkbox does not open its exercise.
- All 9 checked → "All 9 done".
- Reset: cancel keeps state, accept clears it, and the cleared state persists across reload.
  `window.confirm` was stubbed (and asserted to be called twice) because the MCP harness intercepts
  native dialogs. The native dialog UI itself was not exercised.
- Blocked storage (simulated by making `Storage.prototype.getItem/setItem` throw): the notice appears,
  checkboxes still work in memory ("1 of 9 done"), and there are no page errors.

## 2. Player probe on the live deployment — `tests/player-checks.js`

| # | ID | Embed doc HTTP | Referer sent | Play pressed | After ~7 s | Error / sign-in |
|---|---|---|---|---|---|---|
| 1 | zeQ_vRyB35Q | 200 | https://bockmabe.github.io/ | yes | playing, t=6.29 s | none |
| 2 | tTOnOCHlBNI | 200 | https://bockmabe.github.io/ | yes | playing, t=6.18 s | none |
| 3 | U7fM_XEC0mM | 200 | https://bockmabe.github.io/ | yes | playing, t=6.63 s | none |
| 4 | YKVi-BsdKw4 | 200 | https://bockmabe.github.io/ | yes | playing, t=6.51 s | none |
| 5 | zvZp4FJjME4 | 200 | https://bockmabe.github.io/ | yes | playing, t=6.41 s | none |
| 6 | N_s9em1xTqU | 200 | https://bockmabe.github.io/ | yes | playing (pre-roll ad); after skip, main video playing (dur 70 s) | none |
| 7 | -YypsmQZpqY | 200 | https://bockmabe.github.io/ | yes | playing, t=6.49 s (visually confirmed by screenshot) | none |
| 8 | XGnRUc7jxDA | 200 | https://bockmabe.github.io/ | yes | playing (pre-roll ad); after skip, main video playing (dur 31.1 s) | none |
| 9 | Alzv_xogZr8 | 200 | https://bockmabe.github.io/ | yes | playing, t=6.40 s | none |

"Playing" = `video.paused === false`, `readyState 4`, `currentTime > 0`.

Three distinct claims, kept separate:
1. **Iframe HTTP response.** Verified: 200 for all 9 at the live HTTPS URL, with an HTTPS Referer sent.
2. **Playable state in automated Chromium.** Verified: all 9 reached playback after pressing Play.
3. **Physical iPhone Safari playback.** **Not verified.** No physical device was available. The Error 153
   cause (missing Referer, e.g. from a `file://` or non-HTTPS page) is addressed by serving over HTTPS with
   an explicit referrer policy, and the Referer is confirmed sent in Chromium. iOS WebKit has not been
   observed directly.

Console errors seen during playback were all inside the `youtube-nocookie.com` iframe: CORS failures
on YouTube/DoubleClick ad-tracking requests. There were none from the site's own code.

## 3. Other checks
- `curl` HTTPS 200 for the live page after Pages build `built` (about 20 s after enabling).
- oEmbed 200 and watch page 200 for all 9 IDs. Watch-page `playableInEmbed: true` for all 9 (`VIDEOS.md`).
- Visual review at 390 px of the collapsed list and of an expanded card with a loaded player.

## Not tested / limitations
- Physical iPhone Safari, iOS Lockdown Mode, Private Browsing's real storage behavior (blocked storage
  was simulated), VoiceOver.
- WebKit engine in Playwright (only Chromium was used).
- Results reflect YouTube behavior on 2026-10-24.

## Manual iPhone check (for a human)
1. On the iPhone, open https://bockmabe.github.io/youth-athletic-development/ in Safari.
2. Open each exercise, tap Play, and confirm the video plays inline with no "Error 153".
3. Tick two boxes, close Safari, reopen the page, and confirm both ticks remain.
4. If any player fails, confirm "Watch on YouTube" opens the same video, then note the video number.
