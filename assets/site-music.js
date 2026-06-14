(() => {
  const SONGS = [
    '/assets/MATTBEAR%20-%20Elongated.mp3',
    '/assets/MATTBEAR - Elongated.mp3',
    '/assets/elongated.mp3',
    '/assets/audio/elongated.mp3'
  ];
  const STORAGE_KEY = 'mattbearMusicPlayer:v1';

  if (window.__MATTBEAR_MUSIC_LOADED__) return;
  window.__MATTBEAR_MUSIC_LOADED__ = true;

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/site-music-sw.js', { scope: '/' }).catch(() => {});
  }

  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  })();

  const audio = document.createElement('audio');
  audio.preload = 'metadata';
  audio.loop = true;
  audio.volume = typeof saved.volume === 'number' ? saved.volume : 0.72;
  audio.src = saved.src || SONGS[0];

  const player = document.createElement('div');
  player.className = `mb-music-player${saved.hidden ? ' mb-hidden' : ''}`;
  player.innerHTML = `
    <button class="mb-music-toggle" type="button" aria-label="Play music">▶</button>
    <span class="mb-music-info">
      <span class="mb-music-title">MATTBEAR - Elongated</span>
      <span class="mb-music-sub">sitewide music</span>
    </span>
    <button class="mb-music-close" type="button" aria-label="Hide music player">×</button>
    <span class="mb-music-bar">
      <span class="mb-music-progress"><i></i></span>
      <span class="mb-music-time">0:00 / 0:00</span>
    </span>
  `;

  function save(extra = {}) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        src: audio.src,
        volume: audio.volume,
        hidden: player.classList.contains('mb-hidden'),
        ...extra
      }));
    } catch {}
  }

  function fmt(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function update() {
    const btn = player.querySelector('.mb-music-toggle');
    const fill = player.querySelector('.mb-music-progress i');
    const time = player.querySelector('.mb-music-time');
    btn.textContent = audio.paused ? '▶' : 'Ⅱ';
    btn.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music');
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
  }

  function tryNextSource() {
    const current = decodeURI(audio.src.replace(location.origin, ''));
    const idx = SONGS.findIndex(src => decodeURI(src) === current);
    const next = SONGS[idx + 1];
    if (!next) {
      const sub = player.querySelector('.mb-music-sub');
      sub.textContent = 'add MP3 to /assets/';
      update();
      return;
    }
    audio.src = next;
    save({ src: next });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(player);
    document.body.appendChild(audio);
    const toggle = player.querySelector('.mb-music-toggle');
    const close = player.querySelector('.mb-music-close');
    const progress = player.querySelector('.mb-music-progress');

    toggle.addEventListener('click', async () => {
      try {
        if (audio.paused) await audio.play();
        else audio.pause();
      } catch {
        player.querySelector('.mb-music-sub').textContent = 'tap again after page loads';
      }
      update();
    });

    close.addEventListener('click', () => {
      player.classList.add('mb-hidden');
      audio.pause();
      save({ hidden: true });
    });

    progress.addEventListener('click', event => {
      if (!audio.duration) return;
      const rect = progress.getBoundingClientRect();
      const pct = (event.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
      update();
    });

    audio.addEventListener('timeupdate', update);
    audio.addEventListener('loadedmetadata', update);
    audio.addEventListener('play', update);
    audio.addEventListener('pause', update);
    audio.addEventListener('error', tryNextSource);
    update();
  });
})();
