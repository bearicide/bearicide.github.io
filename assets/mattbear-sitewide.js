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
    fallbackDescription: "MATTBEAR by Bearicide Productions: AI-assisted music, browser games, web tools, creative systems, local projects, and community routes."
  };

  const routeMeta = {
    "/": {
      title: "MATTBEAR | Bearicide Productions",
      description: "MATTBEAR is the main Bearicide Productions hub for AI-assisted music, browser games, creative web tools, visual projects, local work, and community routes.",
      section: "public creative ecosystem"
    },
    "/index.html": {
      title: "MATTBEAR | Bearicide Productions",
      description: "MATTBEAR is the main Bearicide Productions hub for AI-assisted music, browser games, creative web tools, visual projects, local work, and community routes.",
      section: "public creative ecosystem"
    },
    "/projects.html": {
      title: "MATTBEAR Projects | Websites, Games, Music & Tools",
      description: "Explore MATTBEAR projects from Bearicide Productions: websites, browser games, music tools, local pages, community routes, and creative experiments.",
      section: "project map"
    },
    "/examples/": {
      title: "MATTBEAR Examples | Websites, Promo Work & Creative Projects",
      description: "Selected MATTBEAR examples: websites, promo graphics, local business pages, artist pages, portfolio work, and creative project samples.",
      section: "examples hub"
    },
    "/MATTBEARCADE/": {
      title: "MATTBEARCADE | Browser Games by Bearicide Productions",
      description: "MATTBEARCADE is the playable games wing of MATTBEAR with browser games, word machines, slot-style demos, arcade experiments, and interactive toys.",
      section: "arcade"
    },
    "/music/": {
      title: "MATTBEAR Music | Spotify, Releases & Audio Tools",
      description: "MATTBEAR music route for Spotify, Bearicide Music, All Fall Down, SoundCloud, audio tools, browser instruments, The Choppa, and connected media projects.",
      section: "music"
    },
    "/music-toys/": {
      title: "MATTBEAR Music Tools | Browser Audio Experiments",
      description: "MATTBEAR Music Tools collects The Choppa, browser pad labs, MIDI ideas, audio toys, sampler routes, and experimental sound tools.",
      section: "browser audio tools"
    },
    "/HiberNation/": {
      title: "HiberNation | MATTBEAR Community & Media Hub",
      description: "HiberNation is the MATTBEAR community and media hub for shared projects, creative updates, music routes, collaboration, events, and connected work.",
      section: "community and media hub"
    },
    "/about/": {
      title: "About MATTBEAR | Bearicide Productions",
      description: "About MATTBEAR, Bearicide Productions, and the connected creative ecosystem for websites, games, music tools, community routes, and local work.",
      section: "ecosystem identity"
    },
    "/map/": {
      title: "MATTBEAR Interactive Map | Bearicide Productions",
      description: "A clickable MATTBEAR ecosystem map for websites, games, music, community, local work, examples, and project routes.",
      section: "interactive ecosystem map"
    },
    "/midwest-made/": {
      title: "Midwest Made | Local Website & Promo Work by MATTBEAR",
      description: "Midwest Made is the MATTBEAR local work hub for restaurant pages, regional projects, local business examples, and public-facing service routes.",
      section: "local business and regional projects"
    },
    "/mattbear-allfalldown/": {
      title: "Bearicide Music | MATTBEAR on Spotify",
      description: "Bearicide Music is the MATTBEAR release hub for All Fall Down, Spotify listening links, SoundCloud, Suno, promo videos, cover art, and connected music projects.",
      section: "music release and Spotify hub"
    },
    "/all-fall-down/": {
      title: "All Fall Down | Bearicide Music",
      description: "All Fall Down now routes to the upgraded Bearicide Music hub for MATTBEAR on Spotify, SoundCloud, Suno, promo videos, and connected release links.",
      section: "release route bridge"
    },
    "/fallen-earth/": {
      title: "Fallen Earth | MATTBEAR Visual World",
      description: "Fallen Earth is an atmospheric MATTBEAR route for visual worldbuilding, mood, experimental presentation, and connected media work.",
      section: "visual worldbuilding"
    },
    "/trading-cards/": {
      title: "MATTBEAR Trading Cards | Printable Creative Assets",
      description: "Printable MATTBEAR trading cards, character cards, event cards, collectible-style layouts, and creative asset experiments.",
      section: "trading cards"
    },
    "/promo/": {
      title: "MATTBEAR Promo Hub | Bearicide Productions",
      description: "Promo routes, announcement graphics, release panels, campaign visuals, and shareable media from MATTBEAR and Bearicide Productions.",
      section: "promo hub"
    }
  };

  const script = document.currentScript || {};
  const data = script.dataset || {};
  const normalizePath = (path) => {
    if (!path || path === "/index.html") return "/";
    if (path.endsWith("/index.html")) return path.replace(/index\.html$/, "");
    return path;
  };
  const path = normalizePath(location.pathname);
  const pageMeta = routeMeta[path] || routeMeta[path + "/"] || {};

  const cfg = {
    page: data.mbPage || pageMeta.title || document.title || "MATTBEAR Page",
    section: data.mbSection || pageMeta.section || "MATTBEAR Ecosystem",
    movement: data.mbMovement || "HiberNation",
    artist: data.mbArtist || "MATTBEAR",
    description: data.mbDescription || pageMeta.description || document.querySelector('meta[name="description"]')?.content || SITE.fallbackDescription,
    home: data.mbHome || SITE.origin + "/",
    hub: data.mbHub || SITE.origin + "/HiberNation/",
    music: data.mbMusic || SITE.origin + "/music/",
    musicTools: data.mbMusicTools || SITE.origin + "/music-toys/",
    choppa: data.mbChoppa || SITE.origin + "/the-choppa/",
    arcade: data.mbArcade || SITE.origin + "/MATTBEARCADE/",
    cards: data.mbCards || SITE.origin + "/trading-cards/",
    interactive: data.mbInteractive || SITE.origin + "/interactive/",
    examples: data.mbExamples || SITE.origin + "/examples/",
    soundcloud: data.mbSoundcloud || "https://soundcloud.com/mattbear86",
    suno: data.mbSuno || "https://suno.com/@mattbear86"
  };

  const canonicalUrl = SITE.origin + (path === "/" ? "/" : path);
  const shareTitle = (pageMeta.title || cfg.page).replace(/\s+/g, " ").trim();
  const shareText = cfg.description.replace(/\s+/g, " ").trim();
  const shareUrl = canonicalUrl;

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
      "isPartOf": {
        "@type": "WebSite",
        "name": SITE.name,
        "url": SITE.origin + "/"
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE.organization,
        "url": SITE.origin + "/"
      },
      "creator": {
        "@type": "Person",
        "name": SITE.creator
      }
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
      html{background:#050507;}
      body:not(.mattbear-no-bg){background:#050507;color-scheme:dark;}
      body:not(.mattbear-no-bg)::before{
        content:"" !important;
        position:fixed !important;
        inset:-28px !important;
        z-index:-10 !important;
        pointer-events:none !important;
        background:
          linear-gradient(180deg,rgba(0,0,0,.40),rgba(0,0,0,.92)),
          url('/assets/music/mattbear-bg.jpg') center top/cover no-repeat,
          radial-gradient(circle at 16% 4%,rgba(29,185,84,.20),transparent 30rem),
          radial-gradient(circle at 86% 10%,rgba(255,79,216,.18),transparent 34rem),
          radial-gradient(circle at 50% 100%,rgba(112,221,255,.14),transparent 34rem),
          #050507 !important;
        filter:saturate(1.18) contrast(1.05) !important;
        opacity:.78 !important;
        transform:none !important;
        animation:none !important;
      }
      body:not(.mattbear-no-bg)::after{
        content:"" !important;
        position:fixed !important;
        inset:0 !important;
        z-index:-9 !important;
        pointer-events:none !important;
        background:
          linear-gradient(90deg,rgba(0,0,0,.66),rgba(0,0,0,.18),rgba(0,0,0,.70)),
          linear-gradient(rgba(255,255,255,.026) 1px,transparent 1px) !important;
        background-size:auto,100% 8px !important;
        mix-blend-mode:normal !important;
        opacity:.72 !important;
        animation:none !important;
      }
      .panel,.card,.feature,.machine,.faq details,.pub-card,.pub-route,.pub-note,.detail-main,.detail-side,.quote-card{
        backdrop-filter:blur(12px) saturate(1.1);
      }
    `;
    document.head.appendChild(bg);
  }

  const viewKey = "MATTBEAR_VIEW_" + location.pathname.replace(/[^a-z0-9]/gi, "_");
  let views = 1;
  try {
    views = Number(localStorage.getItem(viewKey) || "0") + 1;
    localStorage.setItem(viewKey, String(views));
  } catch (_) {}

  window.MATTBEAR_SITEWIDE = {
    version: "shared-shell-8-sitewide-music-assets",
    artist: cfg.artist,
    movement: cfg.movement,
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

  // Visible route ring, share/admin panel, and shortcut controls intentionally removed.
  // The script handles metadata, title boost, structured data, sitewide atmosphere, and local page-view state.
})();