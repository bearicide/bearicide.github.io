// BUTTON ANIMAL sample chopping layer
// Safe add-on: does not rewrite the main synth engine.
// Drop one audio file and it becomes 16 Launchkey pad chops.
(() => {
  const $ = (s) => document.querySelector(s);
  const padKeys = ['1','2','3','4','q','w','e','r','a','s','d','f','z','x','c','v'];
  let ctx, buffer = null, fileName = '', active = false;

  function log(text) {
    const r = $('#readout');
    if (r) r.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}<br>` + r.innerHTML.split('<br>').slice(0, 7).join('<br>');
  }

  function toast(text) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 1000);
  }

  async function audioCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  }

  function baseName(name) {
    return name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
  }

  function updateLabels() {
    const pads = document.querySelectorAll('.pad');
    pads.forEach((pad, i) => {
      const name = pad.querySelector('.name');
      const note = pad.querySelector('.note');
      if (name) name.textContent = `${baseName(fileName).slice(0, 11)} ${String(i + 1).padStart(2, '0')}`;
      if (note) note.textContent = 'chop';
    });
    const sel = $('#selName');
    if (sel) sel.textContent = `PAD 01 — ${baseName(fileName).slice(0, 11)} 01`;
    const res = $('#resList');
    if (res) res.innerHTML = `<div class="item"><b>${fileName}</b><span>16 chops</span></div>`;
  }

  async function loadChops(file) {
    if (!file || !file.type.startsWith('audio/')) return false;
    try {
      const ac = await audioCtx();
      buffer = await ac.decodeAudioData(await file.arrayBuffer());
      fileName = file.name;
      active = true;
      updateLabels();
      log(`CHOPPER // ${file.name} split across 16 pads`);
      toast('sample chopped to 16 pads');
      return true;
    } catch (err) {
      console.error(err);
      log(`CHOPPER FAIL // ${file.name}`);
      toast('chop failed');
      return false;
    }
  }

  async function playChop(index, velocity = 1) {
    if (!active || !buffer) return false;
    const ac = await audioCtx();
    const slice = buffer.duration / 16;
    const start = Math.max(0, Math.min(buffer.duration - 0.01, index * slice));
    const dur = Math.max(0.03, Math.min(slice, buffer.duration - start));
    const src = ac.createBufferSource();
    const g = ac.createGain();
    src.buffer = buffer;
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.9 * velocity, ac.currentTime + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    src.connect(g);
    g.connect(ac.destination);
    src.start(0, start, dur);
    flashPad(index);
    log(`CHOP // ${index + 1} ${start.toFixed(2)}s`);
    return true;
  }

  function flashPad(index) {
    const pad = document.querySelectorAll('.pad')[index];
    if (!pad) return;
    pad.classList.add('hit');
    setTimeout(() => pad.classList.remove('hit'), 180);
    const sel = $('#selName');
    const label = pad.querySelector('.name')?.textContent || `Chop ${index + 1}`;
    if (sel) sel.textContent = `PAD ${String(index + 1).padStart(2, '0')} — ${label}`;
  }

  function interceptPads() {
    document.querySelectorAll('.pad').forEach((pad, i) => {
      pad.addEventListener('click', (e) => {
        if (!active) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        playChop(i, e.shiftKey ? 0.65 : 1);
      }, true);
    });
  }

  function interceptKeys() {
    window.addEventListener('keydown', (e) => {
      if (!active || e.repeat) return;
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (['input','select','textarea'].includes(tag) || e.target?.isContentEditable) return;
      const i = padKeys.indexOf(e.key.toLowerCase());
      if (i < 0) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      playChop(i, e.shiftKey ? 0.65 : 1);
    }, true);
  }

  function interceptLoaders() {
    const input = $('#fileInput');
    const drop = $('#dropZone');
    if (input) {
      input.addEventListener('change', async (e) => {
        const audio = [...(e.target.files || [])].find((f) => f.type.startsWith('audio/'));
        if (audio) await loadChops(audio);
      }, true);
    }
    if (drop) {
      drop.addEventListener('drop', async (e) => {
        const audio = [...(e.dataTransfer?.files || [])].find((f) => f.type.startsWith('audio/'));
        if (!audio) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        await loadChops(audio);
      }, true);
    }
  }

  function midiLayer() {
    const midiBtn = $('#midiBtn');
    if (!midiBtn || !navigator.requestMIDIAccess) return;
    midiBtn.addEventListener('click', async () => {
      try {
        const midi = await navigator.requestMIDIAccess();
        for (const input of midi.inputs.values()) {
          input.addEventListener?.('midimessage', (e) => {
            if (!active) return;
            const [status, note, value] = e.data;
            const cmd = status & 240;
            if (cmd === 144 && value > 0 && note >= 36 && note <= 51) playChop(note - 36, value / 127);
          });
        }
      } catch (_) {}
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      interceptPads();
      interceptKeys();
      interceptLoaders();
      midiLayer();
    });
  });
})();
