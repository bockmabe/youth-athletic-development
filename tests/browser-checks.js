// Development-only browser checks. Not loaded by the site.
// Run through the Playwright MCP `browser_run_code_unsafe` tool (filename: tests/browser-checks.js)
// after navigating to the page under test. Returns a JSON report; every check has pass: true/false.
async (page) => {
  const url = page.url();
  const results = [];
  const check = (name, pass, detail) => results.push({ name, pass: !!pass, detail });
  const overflow = () => page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Structure
  const s = await page.evaluate(() => {
    const details = [...document.querySelectorAll("details[data-video]")];
    return {
      details: details.length,
      checkboxes: document.querySelectorAll('.done input[type="checkbox"]').length,
      interactiveInSummary: document.querySelectorAll("summary input, summary button, summary a, summary label, summary select, summary textarea").length,
      iframesAtLoad: document.querySelectorAll("iframe").length,
      ids: details.map((d) => d.dataset.video),
      fallbacks: details.map((d) => d.querySelector(".watch a")?.href),
      fallbackTargets: details.map((d) => d.querySelector(".watch a")?.target),
      metaReferrer: document.querySelector('meta[name="referrer"]')?.content,
    };
  });
  check("9 exercises with details/summary", s.details === 9, s.details);
  check("9 completion checkboxes", s.checkboxes === 9, s.checkboxes);
  check("no interactive controls nested in summary", s.interactiveInSummary === 0, s.interactiveInSummary);
  check("no iframes before any exercise is opened", s.iframesAtLoad === 0, s.iframesAtLoad);
  check("every fallback link is youtube.com/watch?v=<same id>",
    s.fallbacks.every((h, i) => h === "https://www.youtube.com/watch?v=" + s.ids[i]), s.fallbacks);
  check("fallback links open in new tab", s.fallbackTargets.every((t) => t === "_blank"), s.fallbackTargets);
  check("page referrer meta = strict-origin-when-cross-origin", s.metaReferrer === "strict-origin-when-cross-origin", s.metaReferrer);

  for (const w of [320, 375, 390, 430]) {
    await page.setViewportSize({ width: w, height: 844 });
    const o = await overflow();
    check(`no horizontal overflow @${w}px (collapsed)`, o.scrollWidth <= o.clientWidth, o);
  }
  await page.setViewportSize({ width: 390, height: 844 });

  // Expand/collapse + lazy iframe per exercise
  const summaries = page.locator("details[data-video] > summary");
  for (let i = 0; i < 9; i++) {
    await summaries.nth(i).click();
    // The details "toggle" event is async; wait for the lazy iframe (or time out and fail below).
    await page.waitForFunction((i) => !!document.querySelectorAll("details[data-video]")[i].querySelector(".player iframe"), i, { timeout: 3000 }).catch(() => {});
    const st = await page.evaluate((i) => {
      const d = document.querySelectorAll("details[data-video]")[i];
      const f = d.querySelector(".player iframe");
      const r = f?.getBoundingClientRect();
      return {
        open: d.open,
        src: f?.src,
        refpolAttr: f?.getAttribute("referrerpolicy"),
        refpolProp: f?.referrerPolicy,
        ratio: r ? +(r.width / r.height).toFixed(3) : null,
        totalIframes: document.querySelectorAll("iframe").length,
      };
    }, i);
    const o = await overflow();
    check(`#${i + 1} ${s.ids[i]} opens and lazy-creates nocookie iframe`,
      st.open && st.src?.startsWith("https://www.youtube-nocookie.com/embed/" + s.ids[i] + "?") && st.totalIframes === 1, st);
    check(`#${i + 1} iframe referrerpolicy strict-origin-when-cross-origin`,
      st.refpolAttr === "strict-origin-when-cross-origin" && st.refpolProp === "strict-origin-when-cross-origin", st.refpolAttr);
    check(`#${i + 1} player is 16:9`, Math.abs(st.ratio - 16 / 9) < 0.02, st.ratio);
    check(`#${i + 1} no horizontal overflow while open`, o.scrollWidth <= o.clientWidth, o);
    await summaries.nth(i).click();
    await page.waitForFunction(() => document.querySelectorAll("iframe").length === 0, null, { timeout: 3000 }).catch(() => {});
    const closed = await page.evaluate((i) => {
      const d = document.querySelectorAll("details[data-video]")[i];
      return { open: d.open, iframes: document.querySelectorAll("iframe").length };
    }, i);
    check(`#${i + 1} collapses and removes iframe`, !closed.open && closed.iframes === 0, closed);
  }

  // Persistence + progress
  const boxes = page.locator('.done input[type="checkbox"]');
  for (const i of [0, 3, 8]) await page.locator(".done").nth(i).click();
  const before = await page.locator("#progress-text").textContent();
  await page.reload();
  const after = await page.evaluate(() => ({
    checked: [...document.querySelectorAll('.done input[type="checkbox"]')].map((b) => b.checked),
    text: document.getElementById("progress-text").textContent,
    width: document.getElementById("meter-fill").style.width,
  }));
  check("progress text updates on check", before === "3 of 9 done", before);
  check("checkboxes persist after reload",
    JSON.stringify(after.checked) === JSON.stringify([true, false, false, true, false, false, false, false, true]), after.checked);
  check("progress restored after reload", after.text === "3 of 9 done" && after.width.startsWith("33.3"), after);

  // Tapping the checkbox must not toggle the details
  const openAfterCheck = await page.evaluate(() => document.querySelectorAll("details[open]").length);
  check("checking a box does not open the exercise", openAfterCheck === 0, openAfterCheck);

  for (let i = 0; i < 9; i++) if (!(await boxes.nth(i).isChecked())) await page.locator(".done").nth(i).click();
  check("all done message", (await page.locator("#progress-text").textContent()).startsWith("All 9 done"));

  // Reset (cancel, then accept). window.confirm is stubbed because the MCP harness
  // intercepts native dialogs; the stub records that confirm() was actually called.
  await page.evaluate(() => { window.__confirms = []; window.confirm = (m) => { window.__confirms.push(m); return false; }; });
  await page.click("#reset");
  check("reset cancel keeps state", (await page.locator("#progress-text").textContent()).startsWith("All 9"));
  await page.evaluate(() => { window.confirm = (m) => { window.__confirms.push(m); return true; }; });
  await page.click("#reset");
  check("reset asks for confirmation each time", (await page.evaluate(() => window.__confirms.length)) === 2);
  await page.reload();
  check("reset clears state across reload", (await page.locator("#progress-text").textContent()) === "0 of 9 done");

  // Blocked storage (simulated: setItem/getItem throw, as in some locked-down browsers)
  const p2 = await page.context().newPage();
  await p2.setViewportSize({ width: 390, height: 844 });
  await p2.addInitScript(() => {
    const boom = () => { throw new DOMException("blocked", "SecurityError"); };
    Storage.prototype.setItem = boom;
    Storage.prototype.getItem = boom;
  });
  const errors = [];
  p2.on("pageerror", (e) => errors.push(String(e)));
  await p2.goto(url);
  await p2.locator(".done").nth(1).click();
  const blocked = await p2.evaluate(() => ({
    noteVisible: !document.getElementById("storage-note").hidden,
    text: document.getElementById("progress-text").textContent,
  }));
  check("blocked storage: notice shown, still works in memory, no errors",
    blocked.noteVisible && blocked.text === "1 of 9 done" && errors.length === 0, { blocked, errors });
  await p2.close();

  const failed = results.filter((r) => !r.pass);
  return JSON.stringify({ url, total: results.length, passed: results.length - failed.length, failed,
    passedNames: results.filter((r) => r.pass).map((r) => r.name) }, null, 1);
}
