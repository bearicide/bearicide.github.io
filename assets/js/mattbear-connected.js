/* MATTBEAR Connected Page Controller
   Local-first tracker only. Visible mini-player/admin UI removed by request. */
(function(){
  const CONFIG_URL = '/data/site-settings.json';
  const OVERRIDE_KEY = 'mattbear.site.override';
  const COUNTER_KEY = 'mattbear.pageCounters.v1';

  const defaults = {
    site:{name:'MATTBEAR',tagline:'Chaos → Signal'},
    links:{main:'https://bearicide.github.io/',soundcloud:'https://soundcloud.com/mattbear86'},
    features:{adminPanel:false,miniPlayer:false,tracker:true},
    miniPlayer:{enabled:false,label:'MATTBEAR Mini-Player',source:'local-audio',trackTitle:'HiberNation Theme',audioUrl:'/assets/audio/hibernation-theme.mp3',loop:true,volume:.35,startOnSiteJoin:false,profileUrl:'https://soundcloud.com/mattbear86'},
    tracker:{enabled:true,storageKey:COUNTER_KEY}
  };

  function merge(a,b){
    const out = Array.isArray(a) ? [...a] : {...a};
    Object.keys(b||{}).forEach(k=>{
      out[k] = b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) ? merge(out[k]||{}, b[k]) : b[k];
    });
    return out;
  }

  async function getConfig(){
    let cfg = defaults;
    try{
      const res = await fetch(CONFIG_URL,{cache:'no-store'});
      if(res.ok) cfg = merge(cfg, await res.json());
    }catch(e){}
    try{
      const local = JSON.parse(localStorage.getItem(OVERRIDE_KEY)||'null');
      if(local) cfg = merge(cfg, local);
    }catch(e){}

    // Hard-disable visible UI. Settings can still exist without spawning dock goblins.
    cfg.features = cfg.features || {};
    cfg.features.adminPanel = false;
    cfg.features.miniPlayer = false;
    cfg.miniPlayer = cfg.miniPlayer || {};
    cfg.miniPlayer.enabled = false;
    cfg.miniPlayer.startOnSiteJoin = false;
    return cfg;
  }

  function track(cfg){
    if(!cfg.features?.tracker || !cfg.tracker?.enabled) return;
    const key = cfg.tracker.storageKey || COUNTER_KEY;
    const path = location.pathname || '/';
    let data = {};
    try{ data = JSON.parse(localStorage.getItem(key)||'{}'); }catch(e){ data = {}; }
    data[path] = data[path] || {views:0,lastSeen:null,title:document.title};
    data[path].views += 1;
    data[path].lastSeen = new Date().toISOString();
    data[path].title = document.title;
    try{ localStorage.setItem(key,JSON.stringify(data)); }catch(e){}
    if(cfg.tracker.endpoint){
      fetch(cfg.tracker.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path,title:document.title,ts:data[path].lastSeen})}).catch(()=>{});
    }
  }

  // No mini-player, no admin button, no Ctrl+Shift+M redirect. Humanity may now scroll in peace.
  getConfig().then(cfg=>{ track(cfg); });
})();
