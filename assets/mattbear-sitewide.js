(() => {
  if (window.MATTBEAR_SHARED_SHELL_LOADED) return;
  window.MATTBEAR_SHARED_SHELL_LOADED = true;

  const SITE = {
    name: "MATTBEAR",
    organization: "Bearicide Productions",
    creator: "Matt Baier",
    origin: "https://bearicide.github.io",
    image: "https://bearicide.github.io/assets/music/mattbear-hero.jpg",
    background: "https://bearicide.github.io/assets/music/mattbear-bg.jpg",
    fallbackDescription: "MATTBEAR by Bearicide Productions: websites, music releases, browser games, creative tools, local work, and community projects."
  };

  const routeMeta = {
    "/": { title: "MATTBEAR | Bearicide Productions", description: "MATTBEAR is the Bearicide Productions hub for websites, music releases, browser games, creative tools, local work, and community projects.", section: "public creative ecosystem" },
    "/index.html": { title: "MATTBEAR | Bearicide Productions", description: "MATTBEAR is the Bearicide Productions hub for websites, music releases, browser games, creative tools, local work, and community projects.", section: "public creative ecosystem" },
    "/projects.html": { title: "MATTBEAR Projects | Websites, Games, Music & Tools", description: "MATTBEAR project board for websites, games, music, tools, local work, and public creative routes.", section: "project board" },
    "/examples/": { title: "MATTBEAR Examples | Websites, Promo Work & Creative Projects", description: "Selected MATTBEAR examples: websites, promo graphics, local business pages, artist pages, portfolio work, and creative project samples.", section: "examples hub" },
    "/MATTBEARCADE/": { title: "MATTBEARCADE | Browser Games by Bearicide Productions", description: "MATTBEARCADE is the playable games wing of MATTBEAR with browser games, word machines, arcade experiments, and interactive toys.", section: "arcade" },
    "/music/": { title: "MATTBEAR Music | Spotify, Releases & Audio Tools", description: "MATTBEAR music routes for Spotify, Bearicide Music, All Fall Down, SoundCloud, Suno, audio tools, The Choppa, and connected media projects.", section: "music" },
    "/music-toys/": { title: "MATTBEAR Music Tools | Browser Audio Experiments", description: "MATTBEAR Music Tools collects browser pad labs, MIDI ideas, audio toys, sampler routes, and experimental sound tools.", section: "browser audio tools" },
    "/HiberNation/": { title: "HiberNation | MATTBEAR Community & Media Hub", description: "HiberNation is the MATTBEAR community and media hub for shared projects, creative updates, music routes, collaboration, events, and connected work.", section: "community and media hub" },
    "/about/": { title: "About MATTBEAR | Bearicide Productions", description: "About MATTBEAR, Bearicide Productions, and the connected creative ecosystem for websites, games, music tools, community routes, and local work.", section: "ecosystem identity" },
    "/map/": { title: "MATTBEAR Interactive Map | Bearicide Productions", description: "A clickable MATTBEAR ecosystem map for websites, games, music, community, local work, examples, and project routes.", section: "interactive ecosystem map" },
    "/midwest-made/": { title: "Midwest Made | Local Website & Promo Work by MATTBEAR", description: "Midwest Made is the MATTBEAR local work hub for restaurant pages, regional projects, local business examples, and public-facing service routes.", section: "local business and regional projects" },
    "/mattbear-allfalldown/": { title: "Bearicide Music | MATTBEAR on Spotify", description: "Bearicide Music is the MATTBEAR release hub for All Fall Down, Spotify listening links, SoundCloud, Suno, promo videos, cover art, and connected music projects.", section: "music release and Spotify hub" },
    "/all-fall-down/": { title: "All Fall Down | Bearicide Music", description: "All Fall Down routes to the upgraded Bearicide Music hub for MATTBEAR on Spotify, SoundCloud, Suno, promo visuals, and connected release links.", section: "release route bridge" },
    "/fallen-earth/": { title: "Fallen Earth | MATTBEAR Visual World", description: "Fallen Earth is an atmospheric MATTBEAR route for visual worldbuilding, mood, experimental presentation, and connected media work.", section: "visual worldbuilding" },
    "/trading-cards/": { title: "MATTBEAR Trading Cards | Printable Creative Assets", description: "Printable MATTBEAR trading cards, character cards, event cards, collectible-style layouts, and creative asset experiments.", section: "trading cards" },
    "/promo/": { title: "MATTBEAR Promo Hub | Bearicide Productions", description: "Promo routes, announcement graphics, release panels, campaign visuals, and shareable media from MATTBEAR and Bearicide Productions.", section: "promo hub" },
    "/promo-examples/": { title: "Promo Examples | MATTBEAR Promo Design", description: "MATTBEAR promo examples for flyers, social graphics, announcements, campaign visuals, and local business promos.", section: "promo examples" }
  };

  const script = document.currentScript || {};
  const data = script.dataset || {};
  const normalizePath = (pathname) => {
    if (!pathname || pathname === "/index.html") return "/";
    if (pathname.endsWith("/index.html")) return pathname.replace(/index\.html$/, "");
    return pathname;
  };
  const path = normalizePath(location.pathname);
  const pageMeta = routeMeta[path] || routeMeta[path + "/"] || {};

  const cfg = {
    page: data.mbPage || pageMeta.title || document.title || "MATTBEAR Page",
    section: data.mbSection || pageMeta.section || "MATTBEAR Ecosystem",
    artist: data.mbArtist || "MATTBEAR",
    description: data.mbDescription || pageMeta.description || document.querySelector('meta[name="description"]')?.content || SITE.fallbackDescription,
    soundcloud: data.mbSoundcloud || "https://soundcloud.com/mattbear86",
    suno: data.mbSuno || "https://suno.com/@mattbear86"
  };

  const shareUrl = SITE.origin + (path === "/" ? "/" : path);
  const shareTitle = (pageMeta.title || cfg.page).replace(/\s+/g, " ").trim();
  const shareText = cfg.description.replace(/\s+/g, " ").trim();

  const ensure = (tag, attrs, text) => {
    const selector = attrs.property ? `${tag}[property="${attrs.property}"]` : attrs.name ? `${tag}[name="${attrs.name}"]` : attrs.rel ? `${tag}[rel="${attrs.rel}"]` : null;
    let el = selector ? document.head.querySelector(selector) : null;
    if (!el) {
      el = document.createElement(tag);
      document.head.appendChild(el);
    }
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    if (typeof text === "string") el.textContent = text;
    return el;
  };

  if (pageMeta.title && (!document.title || /creative systems/i.test(document.title))) document.title = pageMeta.title;
  ensure("meta", { name: "description", content: shareText });
  ensure("meta", { name: "author", content: SITE.creator });
  ensure("meta", { name: "robots", content: "index, follow" });
  ensure("link", { rel: "canonical", href: shareUrl });
  ensure("meta", { property: "og:type", content: "website" });
  ensure("meta", { property: "og:site_name", content: `${SITE.name} | ${SITE.organization}` });
  ensure("meta", { property: "og:title", content: shareTitle });
  ensure("meta", { property: "og:description", content: shareText });
  ensure("meta", { property: "og:url", content: shareUrl });
  ensure("meta", { property: "og:image", content: SITE.image });
  ensure("meta", { name: "twitter:card", content: "summary_large_image" });
  ensure("meta", { name: "twitter:title", content: shareTitle });
  ensure("meta", { name: "twitter:description", content: shareText });
  ensure("meta", { name: "twitter:image", content: SITE.image });

  if (!document.querySelector('script[data-mattbear-schema="true"]')) {
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.setAttribute("data-mattbear-schema", "true");
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": path === "/" ? "WebSite" : "WebPage",
      "name": shareTitle,
      "description": shareText,
      "url": shareUrl,
      "image": SITE.image,
      "isPartOf": { "@type": "WebSite", "name": SITE.name, "url": SITE.origin + "/" },
      "publisher": { "@type": "Organization", "name": SITE.organization, "url": SITE.origin + "/" },
      "creator": { "@type": "Person", "name": SITE.creator }
    });
    document.head.appendChild(schema);
  }

  if (!document.querySelector('link[href="/assets/title-boost.css"]')) {
    const boost = document.createElement("link");
    boost.rel = "stylesheet";
    boost.href = "/assets/title-boost.css";
    boost.setAttribute("data-mattbear-title-boost", "true");
    document.head.appendChild(boost);
  }

  if (!document.querySelector('style[data-mattbear-site-bg="true"]')) {
    const bg = document.createElement("style");
    bg.setAttribute("data-mattbear-site-bg", "true");
    bg.textContent = `
      html{background:#050507 !important;}
      body:not(.mattbear-no-bg){
        min-height:100svh !important;
        background:
          linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.58)),
          url('/assets/music/mattbear-bg.jpg') center top/cover fixed no-repeat,
          #050507 !important;
        color-scheme:dark;
      }
      body:not(.mattbear-no-bg)::before{display:none !important;content:none !important;}
      body:not(.mattbear-no-bg)::after{
        content:"" !important;
        position:fixed !important;
        inset:0 !important;
        z-index:0 !important;
        pointer-events:none !important;
        background:
          radial-gradient(circle at 10% 0%,rgba(112,221,255,.10),transparent 30rem),
          radial-gradient(circle at 92% 10%,rgba(255,117,216,.09),transparent 34rem),
          linear-gradient(90deg,rgba(0,0,0,.42),rgba(0,0,0,.06),rgba(0,0,0,.48)) !important;
        opacity:.88 !important;
        mix-blend-mode:normal !important;
      }
      body:not(.mattbear-no-bg)>*{position:relative;z-index:1;}
      .top,.topbar{background:rgba(5,5,8,.48) !important;backdrop-filter:blur(12px) saturate(1.05) !important;}
      .panel,.card,.feature,.machine,.faq details,.pub-card,.pub-route,.pub-note,.detail-main,.detail-side,.quote-card,.bridge-card,.intro-card{
        background:linear-gradient(180deg,rgba(16,20,30,.46),rgba(4,6,10,.34)) !important;
        backdrop-filter:blur(9px) saturate(1.08) !important;
        border-color:rgba(255,255,255,.18) !important;
        box-shadow:0 16px 44px rgba(0,0,0,.30),inset 0 0 0 1px rgba(255,255,255,.035) !important;
      }
      .pub-card:before,.card:before,.feature:before,.machine:before{opacity:.42 !important;}
      .home-intro,.hero .panel,.pub-hero{background:linear-gradient(180deg,rgba(12,16,24,.42),rgba(4,6,10,.28)) !important;}
      .mb-linked-hero{width:min(1380px,calc(100% - 24px));margin:16px auto 14px;}
      .mb-linked-hero img{display:block;width:100%;height:auto;aspect-ratio:1983/708;object-fit:cover;border:1px solid rgba(255,255,255,.20);border-radius:24px;background:rgba(0,0,0,.18);box-shadow:0 18px 54px rgba(0,0,0,.34);}
      @media(max-width:720px){.mb-linked-hero{width:calc(100% - 14px);margin:10px auto 10px}.mb-linked-hero img{border-radius:16px}}
    `;
    document.head.appendChild(bg);
  }

  const linkedHeroPaths = new Set([
    "/projects.html",
    "/examples/",
    "/MATTBEARCADE/",
    "/music/",
    "/HiberNation/",
    "/map/",
    "/midwest-made/",
    "/website-design.html",
    "/promo-design.html",
    "/promo-examples/",
    "/project-packages.html",
    "/about/"
  ]);

  const hasHeroArt = () => document.querySelector('.home-hero-art,.hero-img,.bridge-art,.mb-linked-hero,img[src="/assets/music/mattbear-hero.jpg"]');
  if (linkedHeroPaths.has(path) && !document.body.classList.contains('mattbear-no-hero') && !hasHeroArt()) {
    const main = document.querySelector('main');
    if (main) {
      const hero = document.createElement('section');
      hero.className = 'mb-linked-hero';
      hero.setAttribute('aria-label', 'MATTBEAR hero banner');
      hero.innerHTML = '<img src="/assets/music/mattbear-hero.jpg" alt="MATTBEAR Bearicide Productions banner">';
      main.insertBefore(hero, main.firstChild);
    }
  }

  const viewKey = "MATTBEAR_VIEW_" + location.pathname.replace(/[^a-z0-9]/gi, "_");
  let views = 1;
  try {
    views = Number(localStorage.getItem(viewKey) || "0") + 1;
    localStorage.setItem(viewKey, String(views));
  } catch (_) {}

  window.MATTBEAR_SITEWIDE = {
    version: "shared-shell-10-visible-background",
    artist: cfg.artist,
    page: shareTitle,
    section: cfg.section,
    shareTitle,
    shareText,
    shareUrl,
    canonicalUrl: shareUrl,
    socialImage: SITE.image,
    backgroundImage: SITE.background,
    pageViewsLocalOnly: views,
    visibleButtons: false,
    adminPanel: false,
    miniPlayer: false
  };
})();