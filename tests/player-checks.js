// Development-only: per-video embed/playback probe. Run via the Playwright MCP
// `browser_run_code_unsafe` tool (filename: tests/player-checks.js) after navigating to the page.
// For each exercise: open it, record the embed document's HTTP status and the Referer the browser
// actually sent, press Play inside the iframe, wait, then read the <video> element state and any
// visible YouTube error/sign-in text. Visual evidence is captured separately (not committed).
async (page) => {
  const out = [];
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(page.url());
  const n = await page.locator("details[data-video]").count();
  for (let i = 0; i < n; i++) {
    const details = page.locator("details[data-video]").nth(i);
    const id = await details.getAttribute("data-video");
    const respP = page.waitForResponse((r) => r.url().includes("youtube-nocookie.com/embed/" + id), { timeout: 15000 }).catch(() => null);
    await details.locator("summary").click();
    const resp = await respP;
    const rec = { id, embedStatus: resp ? resp.status() : null, refererSent: resp ? (await resp.request().allHeaders())["referer"] || null : null };
    const handle = await details.locator(".player iframe").elementHandle({ timeout: 5000 }).catch(() => null);
    let frame = handle ? await handle.contentFrame() : null;
    if (frame) await frame.waitForLoadState("domcontentloaded").catch(() => {});
    if (!frame) { rec.error = "iframe frame not found"; out.push(rec); await details.locator("summary").click(); continue; }
    await frame.waitForSelector("video, .ytp-error, .ytmCuedOverlayPlayButton, .ytp-large-play-button", { timeout: 15000 }).catch(() => {});
    rec.preErrorText = await frame.evaluate(() => (document.querySelector(".ytp-error")?.innerText || "").trim()).catch(() => null);
    await details.scrollIntoViewIfNeeded();
    const btn = frame.locator('.ytmCuedOverlayPlayButton, button[aria-label="Play video"], .ytp-large-play-button').first();
    rec.playButtonFound = (await btn.count()) > 0;
    if (rec.playButtonFound) await btn.click({ timeout: 5000 }).catch((e) => { rec.clickError = String(e).slice(0, 120); });
    await page.waitForTimeout(7000);
    Object.assign(rec, await frame.evaluate(() => {
      const v = document.querySelector("video");
      const txt = (sel) => (document.querySelector(sel)?.innerText || "").trim().replace(/\s+/g, " ").slice(0, 160);
      return {
        videoPresent: !!v,
        paused: v ? v.paused : null,
        currentTime: v ? +v.currentTime.toFixed(2) : null,
        readyState: v ? v.readyState : null,
        adShowing: !!document.querySelector(".ad-showing"),
        errorText: txt(".ytp-error") || null,
        signInPrompt: /sign in to confirm/i.test(document.body.innerText),
        title: txt(".ytp-title-link") || null,
      };
    }).catch((e) => ({ evalError: String(e).slice(0, 120) })));
    rec.playing = rec.videoPresent && rec.paused === false && rec.currentTime > 0;
    out.push(rec);
    await details.locator("summary").click();
    await page.waitForTimeout(300);
  }
  return JSON.stringify({ url: page.url(), ua: await page.evaluate(() => navigator.userAgent), results: out }, null, 1);
}
