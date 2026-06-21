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

  if (!document.querySelector('link[href="/assets/title-boost.css"]')) {
    const boost = document.createElement("link");
    boost.rel = "stylesheet";
    boost.href = "/assets/title-boost.css";
    boost.setAttribute("data-mattbear-title-boost", "true");
    document.head.appendChild(boost);
  }

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
    version:"shared-shell-5-no-visible-buttons",
    artist:cfg.artist,
    movement:cfg.movement,
    page:cfg.page,
    section:cfg.section,
    shareTitle,
    shareText,
    shareUrl,
    pageViewsLocalOnly:views,
    visibleButtons:false,
    adminPanel:false,
    miniPlayer:false
  };

  // Visible route ring, share/admin panel, and shortcut controls intentionally removed.
  // The script now only handles metadata, title boost, and local page-view state.
})();
