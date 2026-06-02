(() => {
  const currentScript = document.currentScript || {};
  const dataset = currentScript.dataset || {};
  const cfg = {
    page: dataset.mbPage || document.title || "MATTBEAR Page",
    section: dataset.mbSection || "MATTBEAR Ecosystem",
    parent: dataset.mbParent || "",
    movement: dataset.mbMovement || "HiberNation",
    artist: dataset.mbArtist || "MATTBEAR",
    home: dataset.mbHome || "https://bearicide.github.io/",
    hub: dataset.mbHub || "https://bearicide.github.io/HiberNation/",
    examples: dataset.mbExamples || "https://bearicide.github.io/examples/",
    soundcloud: dataset.mbSoundcloud || "https://soundcloud.com/mattbear86",
    suno: dataset.mbSuno || "https://suno.com/@mattbear86"
  };

  const KEY = "MATTBEAR_SITEWIDE_ADMIN_OPEN";
  const pageKey = "MATTBEAR_PAGE_VIEW_" + location.pathname.replace(/[^a-z0-9]/gi, "_");
  let views = 1;
  try {
    views = Number(localStorage.getItem(pageKey) || "0") + 1;
    localStorage.setItem(pageKey, String(views));
  } catch (_) {}

  window.MATTBEAR_SITEWIDE = {
    version: "admin-theme-layer-1",
    artist: cfg.artist,
    movement: cfg.movement,
    page: cfg.page,
    pageViewsLocalOnly: views,
    adminReady: true,
    backendReady: true,
    uploadReady: false,
    note: "Static/admin-ready shell only. Real uploads require authenticated backend/API."
  };

  const css = `
  :root{
    --mb-admin-bg: rgba(5,5,5,.94);
    --mb-admin-text:#f7f0df;
    --mb-admin-muted:#c8bca8;
    --mb-admin-line:rgba(255,255,255,.16);
    --mb-admin-gold:#caa96b;
    --mb-admin-cyan:#7fd7ff;
    --mb-admin-mag:#ff5fd2;
    --mb-admin-green:#7dff9f;
  }
  .mb-site-ring{position:fixed;left:10px;bottom:10px;z-index:9998;display:flex;gap:7px;flex-wrap:wrap;max-width:min(520px,calc(100vw - 20px));pointer-events:none}
  .mb-site-ring a{pointer-events:auto;text-decoration:none;color:var(--mb-admin-text);border:1px solid var(--mb-admin-line);background:rgba(5,5,5,.76);backdrop-filter:blur(10px);border-radius:999px;padding:7px 9px;font:900 10px/1 Bahnschrift,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase}
  .mb-site-ring a:hover{border-color:rgba(127,215,255,.52);box-shadow:0 0 16px rgba(127,215,255,.16)}
  .mb-admin-toggle{position:fixed;right:10px;bottom:10px;z-index:10000;border:1px solid rgba(202,169,107,.46);border-radius:12px;background:linear-gradient(180deg,rgba(24,24,24,.96),rgba(5,5,5,.98));color:var(--mb-admin-text);box-shadow:0 20px 54px rgba(0,0,0,.54),0 0 24px rgba(255,95,210,.12);padding:9px 10px;font:1000 11px/1 Bahnschrift,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}
  .mb-admin-toggle span{background:linear-gradient(90deg,#ff4747,#ffbf5f,#ffef65,#7dff9f,#7fd7ff,#8b6dff,#ff5fd2);-webkit-background-clip:text;background-clip:text;color:transparent}
  .mb-admin-panel{position:fixed;right:10px;bottom:54px;z-index:9999;width:min(360px,calc(100vw - 20px));max-height:70vh;overflow:auto;color:var(--mb-admin-text);background:linear-gradient(180deg,rgba(18,18,18,.98),rgba(4,4,4,.98));border:1px solid rgba(202,169,107,.38);border-radius:16px;box-shadow:0 26px 72px rgba(0,0,0,.58),0 0 30px rgba(127,215,255,.10);padding:13px;display:none}
  .mb-admin-panel.open{display:block}
  .mb-admin-head{display:flex;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid var(--mb-admin-line);padding-bottom:10px;margin-bottom:10px}
  .mb-admin-title{font:1000 16px/.95 Bahnschrift,Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;margin:0}
  .mb-rainbow{background:linear-gradient(90deg,#ff4747,#ffbf5f,#ffef65,#7dff9f,#7fd7ff,#8b6dff,#ff5fd2);-webkit-background-clip:text;background-clip:text;color:transparent}
  .mb-admin-pill{border:1px solid rgba(125,255,159,.28);color:var(--mb-admin-green);border-radius:999px;padding:4px 7px;font:900 9px/1 Bahnschrift,Arial,sans-serif;text-transform:uppercase;letter-spacing:.09em;background:rgba(125,255,159,.06)}
  .mb-admin-panel p{color:var(--mb-admin-muted);margin:8px 0;line-height:1.42;font:600 12px/1.42 Arial,sans-serif}
  .mb-admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:10px 0}
  .mb-admin-grid a,.mb-admin-copy{display:flex;align-items:center;justify-content:center;min-height:34px;text-align:center;text-decoration:none;color:var(--mb-admin-text);border:1px solid var(--mb-admin-line);border-radius:9px;background:rgba(255,255,255,.045);font:900 10px/1.1 Bahnschrift,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;padding:7px;cursor:pointer}
  .mb-admin-grid a:hover,.mb-admin-copy:hover{border-color:rgba(127,215,255,.5);box-shadow:0 0 14px rgba(127,215,255,.13)}
  .mb-admin-status{display:grid;gap:6px;margin-top:10px}
  .mb-admin-status div{display:flex;justify-content:space-between;gap:8px;border:1px solid rgba(255,255,255,.10);border-radius:9px;background:rgba(255,255,255,.035);padding:8px;color:var(--mb-admin-muted);font:800 11px/1.1 Arial,sans-serif}
  .mb-admin-status b{color:var(--mb-admin-gold);font-weight:1000}
  .mb-admin-note{border-left:3px solid var(--mb-admin-green);background:rgba(125,255,159,.07);border-radius:0 8px 8px 0;padding:8px;color:var(--mb-admin-text)!important}
  @media(max-width:640px){
    .mb-site-ring{left:7px;bottom:54px;max-width:calc(100vw - 14px)}
    .mb-site-ring a{font-size:9px;padding:6px 7px}
    .mb-admin-toggle{right:7px;bottom:7px}
    .mb-admin-panel{right:7px;bottom:50px;width:calc(100vw - 14px)}
  }`;

  const style = document.createElement("style");
  style.setAttribute("data-mattbear-sitewide-style", "true");
  style.textContent = css;
  document.head.appendChild(style);

  const ring = document.createElement("nav");
  ring.className = "mb-site-ring";
  ring.setAttribute("aria-label", "MATTBEAR sitewide links");
  ring.innerHTML = `
    <a href="${cfg.home}">HOME</a>
    <a href="${cfg.hub}">HiberNation</a>
    <a href="${cfg.examples}">Examples</a>
  `;
  document.body.appendChild(ring);

  const panel = document.createElement("aside");
  panel.className = "mb-admin-panel";
  panel.setAttribute("aria-label", "MATTBEAR admin-ready panel");
  panel.innerHTML = `
    <div class="mb-admin-head">
      <h2 class="mb-admin-title"><span class="mb-rainbow">MATTBEAR</span><br>Admin Panel</h2>
      <span class="mb-admin-pill">backend-ready</span>
    </div>
    <p><strong>${cfg.page}</strong></p>
    <p>${cfg.artist} is the brand / artist / maker. ${cfg.movement} is the movement / ideals / collaboration behind it.</p>
    <p class="mb-admin-note">Static panel active. Real uploads, SoundCloud publishing, media management, and private admin actions need authenticated backend/API access before activation.</p>
    <div class="mb-admin-grid">
      <a href="${cfg.home}">HOME</a>
      <a href="${cfg.hub}">HiberNation</a>
      <a href="${cfg.examples}">Examples</a>
      <a href="${cfg.suno}">Suno</a>
      <a href="${cfg.soundcloud}">SoundCloud</a>
      <button class="mb-admin-copy" type="button">Copy Page JSON</button>
    </div>
    <div class="mb-admin-status">
      <div><span>Page</span><b>${cfg.section}</b></div>
      <div><span>Local views</span><b>${views}</b></div>
      <div><span>Admin shell</span><b>ON</b></div>
      <div><span>Uploads</span><b>LOCKED</b></div>
    </div>
  `;
  document.body.appendChild(panel);

  const toggle = document.createElement("button");
  toggle.className = "mb-admin-toggle";
  toggle.type = "button";
  toggle.innerHTML = `<span>MB</span> Admin`;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "mb-admin-panel");
  panel.id = "mb-admin-panel";
  document.body.appendChild(toggle);

  const setOpen = (open) => {
    panel.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    try { localStorage.setItem(KEY, open ? "1" : "0"); } catch (_) {}
  };
  let open = false;
  try { open = localStorage.getItem(KEY) === "1"; } catch (_) {}
  setOpen(open);

  toggle.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
  panel.querySelector(".mb-admin-copy").addEventListener("click", async () => {
    const payload = JSON.stringify(window.MATTBEAR_SITEWIDE, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      panel.querySelector(".mb-admin-copy").textContent = "Copied";
      setTimeout(() => panel.querySelector(".mb-admin-copy").textContent = "Copy Page JSON", 1200);
    } catch (_) {
      console.log(payload);
      panel.querySelector(".mb-admin-copy").textContent = "Logged";
      setTimeout(() => panel.querySelector(".mb-admin-copy").textContent = "Copy Page JSON", 1200);
    }
  });
})();