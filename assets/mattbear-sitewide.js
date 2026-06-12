(() => {
  if (window.MATTBEAR_SHARED_SHELL_LOADED) return;
  window.MATTBEAR_SHARED_SHELL_LOADED = true;

  const script = document.currentScript || {};
  const data = script.dataset || {};
  const cfg = {
    page: data.mbPage || document.title || "MATTBEAR Page",
    section: data.mbSection || "MATTBEAR Ecosystem",
    movement: data.mbMovement || "HiberNation",
    artist: data.mbArtist || "MATTBEAR",
    description: data.mbDescription || document.querySelector('meta[name="description"]')?.content || "MATTBEAR music, games, tools, community, and creative projects.",
    home: data.mbHome || "https://bearicide.github.io/",
    hub: data.mbHub || "https://bearicide.github.io/HiberNation/",
    music: data.mbMusic || "https://bearicide.github.io/music/",
    musicTools: data.mbMusicTools || "https://bearicide.github.io/music-toys/",
    choppa: data.mbChoppa || "https://bearicide.github.io/the-choppa/",
    arcade: data.mbArcade || "https://bearicide.github.io/MATTBEARCADE/",
    cards: data.mbCards || "https://bearicide.github.io/trading-cards/",
    interactive: data.mbInteractive || "https://bearicide.github.io/interactive/",
    examples: data.mbExamples || "https://bearicide.github.io/examples/",
    soundcloud: data.mbSoundcloud || "https://soundcloud.com/mattbear86",
    suno: data.mbSuno || "https://suno.com/@mattbear86"
  };

  const OPEN_KEY = "MATTBEAR_SHARED_PANEL_OPEN";
  const viewKey = "MATTBEAR_VIEW_" + location.pathname.replace(/[^a-z0-9]/gi, "_");
  let views = 1;
  try {
    views = Number(localStorage.getItem(viewKey) || "0") + 1;
    localStorage.setItem(viewKey, String(views));
  } catch (_) {}

  const shareUrl = location.href;
  const shareTitle = cfg.page.replace(/\s+/g, " ").trim();
  const shareText = cfg.description.replace(/\s+/g, " ").trim();

  const ensureMeta = (selector, attr, value) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      if (selector.includes("property=")) el.setAttribute("property", selector.match(/property=\"([^\"]+)/)?.[1] || "og:title");
      else el.setAttribute("name", selector.match(/name=\"([^\"]+)/)?.[1] || "description");
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  ensureMeta('meta[property="og:title"]', "content", shareTitle);
  ensureMeta('meta[property="og:description"]', "content", shareText);
  ensureMeta('meta[property="og:url"]', "content", shareUrl);
  ensureMeta('meta[property="og:type"]', "content", "website");
  ensureMeta('meta[name="twitter:card"]', "content", "summary_large_image");
  ensureMeta('meta[name="twitter:title"]', "content", shareTitle);
  ensureMeta('meta[name="twitter:description"]', "content", shareText);

  window.MATTBEAR_SITEWIDE = {
    version: "shared-shell-3",
    artist: cfg.artist,
    movement: cfg.movement,
    page: cfg.page,
    section: cfg.section,
    shareTitle,
    shareText,
    shareUrl,
    pageViewsLocalOnly: views,
    shortcut: "Ctrl+Shift+M"
  };

  const css = `
  :root{--mb-text:#fff8eb;--mb-muted:#d8c7a4;--mb-line:rgba(255,255,255,.18);--mb-gold:#ffe07a;--mb-cyan:#35e7ff;--mb-pink:#ff4fd2;--mb-green:#67ff54;--mb-rainbow:linear-gradient(90deg,#ff3434,#ff8a00,#ffe047,#67ff54,#35e7ff,#4f8dff,#9d67ff,#ff4fd2,#ff3434)}
  .mb-site-ring{position:fixed;left:10px;bottom:10px;z-index:9998;display:flex;gap:7px;flex-wrap:wrap;max-width:min(860px,calc(100vw - 20px));pointer-events:none}
  .mb-site-ring a,.mb-site-ring button{pointer-events:auto;position:relative;overflow:hidden;text-decoration:none;color:var(--mb-text);border:1px solid var(--mb-line);background:rgba(5,5,8,.74);backdrop-filter:blur(12px) saturate(1.2);border-radius:999px;padding:8px 10px;font:950 10px/1 Bahnschrift,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;box-shadow:0 0 16px rgba(53,231,255,.1),0 10px 28px rgba(0,0,0,.28);transition:.18s ease;cursor:pointer}
  .mb-site-ring a:after,.mb-site-ring button:after{content:"";position:absolute;inset:-2px;background:var(--mb-rainbow);background-size:240% 100%;opacity:.1;z-index:-1;animation:mbSiteRainbow 7s linear infinite}
  .mb-site-ring a:hover,.mb-site-ring a:focus-visible,.mb-site-ring button:hover,.mb-site-ring button:focus-visible{border-color:rgba(53,231,255,.6);box-shadow:0 0 20px rgba(53,231,255,.24),0 0 38px rgba(255,79,210,.12);outline:none;transform:translateY(-1px)}
  .mb-admin-toggle{position:fixed;right:10px;bottom:10px;z-index:10000;border:1px solid rgba(255,224,122,.5);border-radius:12px;background:linear-gradient(180deg,rgba(24,24,32,.96),rgba(5,5,8,.98));color:var(--mb-text);box-shadow:0 20px 54px rgba(0,0,0,.54),0 0 24px rgba(255,79,210,.14);padding:9px 10px;font:1000 11px/1 Bahnschrift,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;opacity:.32;transition:.18s ease}
  .mb-admin-toggle:hover,.mb-admin-toggle:focus-visible{opacity:1;transform:translateY(-2px);outline:none}
  .mb-admin-toggle span,.mb-rainbow{background:var(--mb-rainbow);background-size:240% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:mbSiteRainbow 7s linear infinite}
  .mb-admin-panel{position:fixed;right:10px;bottom:54px;z-index:9999;width:min(430px,calc(100vw - 20px));max-height:75vh;overflow:auto;color:var(--mb-text);background:linear-gradient(180deg,rgba(18,18,26,.98),rgba(4,4,8,.98));border:1px solid rgba(255,224,122,.38);border-radius:18px;box-shadow:0 26px 72px rgba(0,0,0,.62),0 0 34px rgba(53,231,255,.14),0 0 62px rgba(255,79,210,.08);padding:14px;display:none}
  .mb-admin-panel.open{display:block;animation:mbAdminRise .18s ease-out}
  .mb-admin-head{display:flex;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid var(--mb-line);padding-bottom:10px;margin-bottom:10px}
  .mb-admin-title{font:1000 17px/.95 Bahnschrift,Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;margin:0}
  .mb-admin-pill{border:1px solid rgba(103,255,84,.32);color:var(--mb-green);border-radius:999px;padding:4px 7px;font:900 9px/1 Bahnschrift,Arial,sans-serif;text-transform:uppercase;letter-spacing:.09em;background:rgba(103,255,84,.07)}
  .mb-admin-panel p{color:var(--mb-muted);margin:8px 0;line-height:1.42;font:600 12px/1.42 Arial,sans-serif}
  .mb-admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:10px 0}
  .mb-admin-grid a,.mb-admin-grid button{display:flex;align-items:center;justify-content:center;min-height:35px;text-align:center;text-decoration:none;color:var(--mb-text);border:1px solid var(--mb-line);border-radius:10px;background:rgba(255,255,255,.052);font:900 10px/1.1 Bahnschrift,Arial,sans-serif;letter-spacing:.09em;text-transform:uppercase;padding:7px;cursor:pointer}
  .mb-admin-grid a:hover,.mb-admin-grid button:hover{border-color:rgba(53,231,255,.56);box-shadow:0 0 16px rgba(53,231,255,.16)}
  .mb-admin-status{display:grid;gap:6px;margin-top:10px}
  .mb-admin-status div{display:flex;justify-content:space-between;gap:8px;border:1px solid rgba(255,255,255,.10);border-radius:9px;background:rgba(255,255,255,.04);padding:8px;color:var(--mb-muted);font:800 11px/1.1 Arial,sans-serif}
  .mb-admin-status b{color:var(--mb-gold);font-weight:1000;text-align:right}
  .mb-admin-note{border-left:3px solid var(--mb-green);background:rgba(103,255,84,.075);border-radius:0 8px 8px 0;padding:8px;color:var(--mb-text)!important}
  @keyframes mbSiteRainbow{0%{background-position:0% 50%}100%{background-position:240% 50%}}
  @keyframes mbAdminRise{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
  @media(max-width:720px){.mb-site-ring{left:7px;right:7px;bottom:54px;max-width:none}.mb-site-ring a,.mb-site-ring button{font-size:9px;padding:6px 7px}.mb-admin-toggle{right:7px;bottom:7px}.mb-admin-panel{right:7px;bottom:50px;width:calc(100vw - 14px)}}
  @media(prefers-reduced-motion:reduce){.mb-site-ring a:after,.mb-site-ring button:after,.mb-admin-toggle span,.mb-rainbow{animation:none!important}.mb-admin-panel.open{animation:none!important}}
  `;

  const style = document.createElement("style");
  style.setAttribute("data-mattbear-sitewide-style", "true");
  style.textContent = css;
  document.head.appendChild(style);

  const sharePage = async () => {
    const payload = { title: shareTitle, text: shareText, url: shareUrl };
    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(shareUrl);
        flashShare("Copied URL");
      }
    } catch (_) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        flashShare("Copied URL");
      } catch (err) {
        console.log(shareUrl);
        flashShare("Logged URL");
      }
    }
  };

  const flashShare = (text) => {
    document.querySelectorAll(".mb-share-button").forEach((btn) => {
      const old = btn.textContent;
      btn.textContent = text;
      setTimeout(() => { btn.textContent = old; }, 1200);
    });
  };

  const ring = document.createElement("nav");
  ring.className = "mb-site-ring";
  ring.setAttribute("aria-label", "MATTBEAR shared links");
  ring.innerHTML = `<a href="${cfg.home}">Home</a><a href="${cfg.hub}">HiberNation</a><a href="${cfg.music}">Music</a><a href="${cfg.musicTools}">Music Tools</a><a href="${cfg.choppa}">The Choppa</a><a href="${cfg.arcade}">Arcade</a><a href="${cfg.cards}">Cards</a><a href="${cfg.interactive}">Map</a><button class="mb-share-button" type="button">Share</button>`;
  document.body.appendChild(ring);

  const panel = document.createElement("aside");
  panel.className = "mb-admin-panel";
  panel.id = "mb-admin-panel";
  panel.setAttribute("aria-label", "MATTBEAR shared panel");
  panel.innerHTML = `<div class="mb-admin-head"><h2 class="mb-admin-title"><span class="mb-rainbow">MATTBEAR</span><br>Shared Panel</h2><span class="mb-admin-pill">CTRL SHIFT M</span></div><p><strong>${shareTitle}</strong></p><p>${shareText}</p><p class="mb-admin-note">Same shared shell on connected pages: route ring, share button, local view count, and shortcut panel.</p><div class="mb-admin-grid"><a href="${cfg.home}">Home</a><a href="${cfg.hub}">HiberNation</a><a href="${cfg.music}">Music</a><a href="${cfg.musicTools}">Music Tools</a><a href="${cfg.choppa}">The Choppa</a><a href="${cfg.arcade}">Arcade</a><a href="${cfg.cards}">Cards</a><a href="${cfg.interactive}">Map</a><a href="${cfg.suno}">Suno</a><a href="${cfg.soundcloud}">SoundCloud</a><button class="mb-share-button" type="button">Share Page</button><button class="mb-admin-copy" type="button">Copy JSON</button><button class="mb-admin-close" type="button">Close</button></div><div class="mb-admin-status"><div><span>Page</span><b>${cfg.section}</b></div><div><span>Views here</span><b>${views}</b></div><div><span>Shortcut</span><b>Ctrl+Shift+M</b></div></div>`;
  document.body.appendChild(panel);

  const toggle = document.createElement("button");
  toggle.className = "mb-admin-toggle";
  toggle.type = "button";
  toggle.innerHTML = `<span>MB</span> Share`;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "mb-admin-panel");
  document.body.appendChild(toggle);

  const setOpen = (open) => {
    panel.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    try { localStorage.setItem(OPEN_KEY, open ? "1" : "0"); } catch (_) {}
  };

  try { setOpen(localStorage.getItem(OPEN_KEY) === "1"); } catch (_) { setOpen(false); }

  toggle.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
  panel.querySelector(".mb-admin-close")?.addEventListener("click", () => setOpen(false));
  document.querySelectorAll(".mb-share-button").forEach((btn) => btn.addEventListener("click", sharePage));

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "m") {
      event.preventDefault();
      setOpen(!panel.classList.contains("open"));
    }
    if (event.key === "Escape" && panel.classList.contains("open")) setOpen(false);
  });

  panel.querySelector(".mb-admin-copy")?.addEventListener("click", async () => {
    const payload = JSON.stringify(window.MATTBEAR_SITEWIDE, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      flashShare("Copied JSON");
    } catch (_) {
      console.log(payload);
      flashShare("Logged JSON");
    }
  });
})();
