(function () {
  "use strict";

  var STORAGE_KEY = "yad-session-v1";
  var EMBED_BASE = "https://www.youtube-nocookie.com/embed/";

  // ── Storage: degrade to in-memory state when localStorage is blocked ──
  var store = (function () {
    try {
      var probe = "__yad_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return window.localStorage;
    } catch (e) {
      return null;
    }
  })();

  function load() {
    if (!store) return {};
    try {
      var parsed = JSON.parse(store.getItem(STORAGE_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    if (!store) return;
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      showStorageNote();
    }
  }

  function showStorageNote() {
    var note = document.getElementById("storage-note");
    if (note) note.hidden = false;
  }

  if (!store) showStorageNote();

  // ── Completion checkboxes + progress ──
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.done input[type="checkbox"]'));
  var state = load();
  var progressText = document.getElementById("progress-text");
  var meterFill = document.getElementById("meter-fill");

  function render() {
    var done = boxes.filter(function (b) { return b.checked; }).length;
    var total = boxes.length;
    progressText.textContent = done === total ? "All " + total + " done 🎉" : done + " of " + total + " done";
    meterFill.style.width = (total ? (done / total) * 100 : 0) + "%";
  }

  boxes.forEach(function (box) {
    box.checked = state[box.dataset.key] === true;
    box.addEventListener("change", function () {
      if (box.checked) state[box.dataset.key] = true;
      else delete state[box.dataset.key];
      save(state);
      render();
    });
  });

  document.getElementById("reset").addEventListener("click", function () {
    if (!boxes.some(function (b) { return b.checked; })) return;
    if (!window.confirm("Clear all checkmarks for a new session?")) return;
    boxes.forEach(function (b) { b.checked = false; });
    state = {};
    save(state);
    render();
  });

  render();

  // ── Videos: create the iframe only when an exercise is opened ──
  function mountPlayer(details) {
    var slot = details.querySelector(".player");
    if (!slot || slot.querySelector("iframe")) return;
    var id = details.dataset.video;
    var iframe = document.createElement("iframe");
    // Explicit referrer policy so YouTube receives the page origin (missing Referer → Error 153).
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.src = EMBED_BASE + encodeURIComponent(id) + "?rel=0&playsinline=1&modestbranding=1";
    iframe.title = "Video: " + (details.dataset.videoTitle || "exercise demonstration");
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.setAttribute("allowfullscreen", "");
    iframe.loading = "eager";
    slot.appendChild(iframe);
  }

  function unmountPlayer(details) {
    // Removing the iframe on close stops any audio still playing in a collapsed card.
    var iframe = details.querySelector(".player iframe");
    if (iframe) iframe.remove();
  }

  Array.prototype.forEach.call(document.querySelectorAll("details[data-video]"), function (details) {
    details.addEventListener("toggle", function () {
      if (details.open) mountPlayer(details);
      else unmountPlayer(details);
    });
    if (details.open) mountPlayer(details);
  });
})();
