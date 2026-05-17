/* MATTBEAR Connected Page Controller
   Local-first now. Backend-ready later. */
(function(){
  const CONFIG_URL = '/data/site-settings.json';
  const OVERRIDE_KEY = 'mattbear.site.override';
  const COUNTER_KEY = 'mattbear.pageCounters.v1';

  const defaults = {
    site:{name:'MATTBEAR',tagline:'Chaos → Signal'},
    links:{main:'https://bearicide.github.io/',soundcloud:'https://soundcloud.com/mattbear86'},
    features:{adminPanel:true,miniPlayer:true,tracker:true},
    miniPlayer:{enabled:true,label:'MATTBEAR Mini-Player',source:'local-audio',trackTitle:'HiberNation Theme',audioUrl:'/assets/audio/hibernation-theme.mp3',loop:true,volume:.35,startOnSiteJoin:true,profileUrl:'https://soundcloud.com/mattbear86'},
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
    return cfg;
  }

  function track(cfg){
    if(!cfg.features?.tracker || !cfg.tracker?.enabled) return;
    const key = cfg.tracker.storageKey || COUNTER_KEY;
    const path = location.pathname || '/';
    const data = JSON.parse(localStorage.getItem(key)||'{}');
    data[path] = data[path] || {views:0,lastSeen:null,title:document.title};
    data[path].views += 1;
    data[path].lastSeen = new Date().toISOString();
    data[path].title = document.title;
    localStorage.setItem(key,JSON.stringify(data));
    if(cfg.tracker.endpoint){
      fetch(cfg.tracker.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path,title:document.title,ts:data[path].lastSeen})}).catch(()=>{});
    }
  }

  function injectStyles(){
    if(document.getElementById('mattbear-connected-style')) return;
    const style=document.createElement('style');
    style.id='mattbear-connected-style';
    style.textContent=`
      .mb-connected-dock{position:fixed;left:12px;bottom:12px;z-index:99999;display:flex;gap:8px;align-items:end;flex-wrap:wrap;font-family:Bahnschrift,Arial,sans-serif}
      .mb-connected-btn,.mb-player-toggle{border:1px solid rgba(255,255,255,.18);background:linear-gradient(90deg,#ff3a6d,#35d9ff,#39ff92);color:#080a10;border-radius:999px;padding:10px 13px;font-weight:900;text-transform:uppercase;text-decoration:none;box-shadow:0 12px 34px rgba(0,0,0,.35);cursor:pointer}
      .mb-player{width:300px;max-width:calc(100vw - 24px);border:1px solid rgba(255,255,255,.15);border-radius:18px;background:rgba(8,10,16,.94);box-shadow:0 16px 44px rgba(0,0,0,.45);overflow:hidden;color:#fff}
      .mb-player-head{padding:10px 12px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;background:rgba(255,255,255,.06);display:flex;justify-content:space-between;gap:8px;align-items:center}
      .mb-player-title{font-size:.82rem;opacity:.9}.mb-player-body{padding:10px 12px;display:grid;gap:8px}.mb-player-row{display:flex;gap:8px;align-items:center;justify-content:space-between}.mb-player-status{font-size:.78rem;color:#bac4d6}.mb-player audio{width:100%;height:34px}.mb-player iframe{display:block;width:100%;height:116px;border:0;background:#111}
      @media(max-width:680px){.mb-connected-dock{right:10px;left:10px}.mb-player{width:100%}.mb-connected-btn,.mb-player-toggle{flex:1;text-align:center}}
    `;
    document.head.appendChild(style);
  }

  function buildLocalPlayer(cfg){
    const mp = cfg.miniPlayer || {};
    const player=document.createElement('div');
    player.className='mb-player';
    const audioId='mattbear-mini-audio';
    player.innerHTML=`
      <div class="mb-player-head"><span>${mp.label || 'MATTBEAR Mini-Player'}</span><span class="mb-player-title">${mp.trackTitle || 'HiberNation Theme'}</span></div>
      <div class="mb-player-body">
        <audio id="${audioId}" preload="auto" ${mp.loop ? 'loop' : ''} src="${mp.audioUrl || ''}"></audio>
        <div class="mb-player-row"><button class="mb-player-toggle" type="button">Join / Play</button><a class="mb-connected-btn" href="${mp.profileUrl || cfg.links?.soundcloud || '#'}" target="_blank" rel="noopener noreferrer">SoundCloud</a></div>
        <div class="mb-player-status">Ready. Starts on site join / first interaction.</div>
      </div>`;
    const audio=player.querySelector('audio');
    const btn=player.querySelector('.mb-player-toggle');
    const status=player.querySelector('.mb-player-status');
    if(audio){ audio.volume = Number.isFinite(mp.volume) ? mp.volume : .35; }
    async function playTheme(){
      if(!audio) return;
      try{ await audio.play(); status.textContent='Playing loop.'; btn.textContent='Pause'; }
      catch(e){ status.textContent='Tap Join / Play to start audio.'; }
    }
    btn?.addEventListener('click',()=>{
      if(audio.paused){ playTheme(); } else { audio.pause(); status.textContent='Paused.'; btn.textContent='Play'; }
    });
    if(mp.startOnSiteJoin){
      const once=()=>{ playTheme(); window.removeEventListener('pointerdown',once); window.removeEventListener('keydown',once); };
      window.addEventListener('pointerdown',once,{once:true});
      window.addEventListener('keydown',once,{once:true});
    }
    audio?.addEventListener('error',()=>{ status.textContent='Local theme missing. Upload /assets/audio/hibernation-theme.mp3'; });
    return player;
  }

  function buildSoundCloudPlayer(cfg){
    const player=document.createElement('details');
    player.className='mb-player';
    player.innerHTML=`<summary>${cfg.miniPlayer?.label || 'MATTBEAR Mini-Player'}</summary><iframe title="MATTBEAR SoundCloud Mini-Player" loading="lazy" allow="autoplay" src="${cfg.miniPlayer?.embedUrl || ''}"></iframe>`;
    return player;
  }

  function injectDock(cfg){
    if(document.getElementById('mattbear-connected-dock')) return;
    injectStyles();
    const dock=document.createElement('div');
    dock.id='mattbear-connected-dock';
    dock.className='mb-connected-dock';

    if(cfg.features?.miniPlayer && cfg.miniPlayer?.enabled){
      const isLocal = cfg.miniPlayer?.source === 'local-audio' || cfg.miniPlayer?.audioUrl;
      dock.appendChild(isLocal ? buildLocalPlayer(cfg) : buildSoundCloudPlayer(cfg));
    }

    if(cfg.features?.adminPanel){
      const admin=document.createElement('a');
      admin.className='mb-connected-btn';
      admin.href='/admin/';
      admin.textContent='Admin';
      dock.appendChild(admin);
    }

    document.body.appendChild(dock);
  }

  document.addEventListener('keydown',e=>{
    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase()==='m') location.href='/admin/';
  });

  getConfig().then(cfg=>{track(cfg);injectDock(cfg);});
})();
