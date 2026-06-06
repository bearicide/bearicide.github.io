// BUTTON ANIMAL app
(() => {
  const $ = (s) => document.querySelector(s);
  const padKeys = ['1','2','3','4','q','w','e','r','a','s','d','f','z','x','c','v'];
  const padNames = ['Kick','Snare','Closed Hat','Open Hat','Clap','Perc','Tom Low','Tom High','Bass 1','Bass 2','Lead 1','Lead 2','Chord 1','Chord 2','Chord 3','FX Hit'];
  const colors = ['#ff34ef','#24f4ff','#b7ff39','#ffd15a','#ff405f','#9e73ff','#44ffbb','#ff8a2a'];
  const fxIds = ['glow','chaos','delay','filter','crush','motion','verb','vol'];
  const fxDefaults = [62,18,22,78,6,28,20,72];
  const noteMap = { C:0, Db:1, D:2, Eb:3, E:4, F:5, Gb:6, G:7, Ab:8, A:9, Bb:10, B:11 };
  const scales = { minor:[0,2,3,5,7,8,10], major:[0,2,4,5,7,9,11], pentatonic:[0,3,5,7,10], blues:[0,3,5,6,7,10], dorian:[0,2,3,5,7,9,10], phrygian:[0,1,3,5,7,8,10] };
  const bankInfo = {
    drums:['DRUM CAVE','Tight synthetic drum kit.'], bass:['BASS SWAMP','Playable bass notes in key.'], glitch:['GLITCH MALL','Rhythmic tuned glitches.'], choir:['CHOIR VOID','Soft chords and pads.'], arcade:['ARCADE','Chiptune notes in key.'], doom:['DOOM','Dark bass/chord engine.'], sparkle:['SPARKLE','Bright plucks and bells.']
  };

  let audio, master, delay, feed, filter, verbSend, verb, crush;
  let seqOn = false, arpOn = false, timer = null, step = 0;
  let bank = 'drums', mode = 'play', selectedPad = 0;
  let safeMode = false, flashy = false, confettiOn = false, sparksOn = false, pumpOn = false;
  let muted = new Set(), recentPads = [], activeSources = [], activeGains = [];
  let samples = Array(16).fill(null), sampleNames = Array(16).fill(null), textures = [];
  let seq = Array.from({ length:16 }, (_, i) => i % 4 ? null : 0);
  let stepsOn = Array.from({ length:16 }, (_, i) => i % 4 === 0);

  function log(text) {
    const r = $('#readout');
    if (!r) return;
    r.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}<br>` + r.innerHTML.split('<br>').slice(0, 7).join('<br>');
  }

  function toast(text) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 1000);
  }

  function setButton(id, on) {
    const el = $('#' + id);
    if (el) el.classList.toggle('active', !!on);
  }

  function unsafed(reason = 'visuals awake') {
    if (safeMode) {
      safeMode = false;
      toast(reason);
      log('SAFE MODE // off');
    }
  }

  async function initAudio() {
    if (audio) return audio;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      alert('Web Audio is not supported in this browser.');
      return null;
    }
    audio = new AudioCtx();
    master = audio.createGain();
    delay = audio.createDelay();
    feed = audio.createGain();
    filter = audio.createBiquadFilter();
    verbSend = audio.createGain();
    verb = audio.createConvolver();
    crush = audio.createWaveShaper();
    master.gain.value = 0.72;
    filter.type = 'lowpass';
    filter.frequency.value = 7200;
    verb.buffer = makeImpulse(1.4, 1.8);
    delay.connect(feed);
    feed.connect(delay);
    delay.connect(filter);
    verbSend.connect(verb);
    verb.connect(filter);
    filter.connect(crush);
    crush.connect(master);
    master.connect(audio.destination);
    $('#audioStatus').textContent = 'audio awake';
    $('#audioStatus').className = 'pill good';
    updateFx();
    log('AUDIO // awake');
    return audio;
  }

  function makeImpulse(seconds, decay) {
    const rate = audio.sampleRate;
    const length = Math.max(1, Math.floor(rate * seconds));
    const buffer = audio.createBuffer(2, length, rate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    return buffer;
  }

  function distortionCurve(amount) {
    const k = amount * 80;
    const n = 2048;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = i * 2 / n - 1;
      curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    return curve;
  }

  function env(gain = 0.5, decay = 0.25) {
    const now = audio.currentTime;
    const gainNode = audio.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    gainNode.connect(filter);
    gainNode.connect(delay);
    gainNode.connect(verbSend);
    activeGains.push(gainNode);
    setTimeout(() => {
      try { gainNode.disconnect(); } catch (_) {}
      activeGains = activeGains.filter((g) => g !== gainNode);
    }, (decay + 0.4) * 1000);
    return gainNode;
  }

  function osc(hz, wave = 'sine', decay = 0.25, gain = 0.4, bend = 0) {
    const o = audio.createOscillator();
    const now = audio.currentTime;
    o.type = wave;
    o.frequency.setValueAtTime(Math.max(20, hz), now);
    if (bend) o.frequency.exponentialRampToValueAtTime(Math.max(20, hz + bend), now + decay * 0.8);
    o.connect(env(gain, decay));
    activeSources.push(o);
    o.onended = () => activeSources = activeSources.filter((x) => x !== o);
    o.start();
    o.stop(now + decay + 0.05);
  }

  function noise(decay = 0.1, tone = 2000, gain = 0.3) {
    const length = Math.max(1, Math.floor(audio.sampleRate * decay));
    const buffer = audio.createBuffer(1, length, audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = audio.createBufferSource();
    const bp = audio.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = tone;
    bp.Q.value = 2.6;
    src.buffer = buffer;
    src.connect(bp);
    bp.connect(env(gain, decay));
    activeSources.push(src);
    src.onended = () => activeSources = activeSources.filter((x) => x !== src);
    src.start();
  }

  const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function scaleMidi(index, octave = 3) {
    const key = noteMap[$('#keySelect').value] ?? 9;
    const sc = scales[$('#scaleSelect').value] || scales.minor;
    return 12 * octave + key + sc[index % sc.length] + Math.floor(index / sc.length) * 12;
  }

  function playSample(i, velocity) {
    if (!samples[i]) return false;
    const src = audio.createBufferSource();
    const g = audio.createGain();
    const now = audio.currentTime;
    src.buffer = samples[i];
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.82 * velocity, now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(src.buffer.duration, 3.5));
    src.connect(g);
    g.connect(filter);
    g.connect(delay);
    g.connect(verbSend);
    activeSources.push(src);
    activeGains.push(g);
    src.onended = () => activeSources = activeSources.filter((x) => x !== src);
    src.start();
    setTimeout(() => {
      try { g.disconnect(); } catch (_) {}
      activeGains = activeGains.filter((x) => x !== g);
    }, (Math.min(src.buffer.duration, 3.5) + 0.5) * 1000);
    return true;
  }

  function drum(i, v) {
    if (i === 0) return osc(118, 'sine', 0.34, 0.95 * v, -82);
    if (i === 1) { noise(0.14, 1900, 0.38 * v); return osc(185, 'triangle', 0.11, 0.22 * v, -25); }
    if (i === 2) return noise(0.055, 8800, 0.18 * v);
    if (i === 3) return noise(0.24, 7200, 0.24 * v);
    if (i === 4) return [0, 22, 44].forEach((ms) => setTimeout(() => noise(0.055, 2600, 0.18 * v), ms));
    if (i === 5) { osc(620, 'triangle', 0.08, 0.22 * v, -140); return noise(0.035, 4100, 0.13 * v); }
    if (i === 6) return osc(120, 'sine', 0.23, 0.46 * v, -35);
    if (i === 7) return osc(210, 'sine', 0.23, 0.46 * v, -55);
    if (i === 15) { noise(0.2, 1200, 0.28 * v); return osc(90, 'sine', 0.35, 0.35 * v, -45); }
    noise(0.055, 7600, 0.12 * v);
  }

  function tuned(i, role = 'lead', v = 1) {
    const voice = $('#voiceSelect').value;
    const musical = $('#musicalSelect').value;
    const root = scaleMidi(i, role === 'bass' ? 2 : 4);
    let intervals = [0];
    if (musical === 'chords' || role === 'choir') intervals = [0, 3, 7];
    if (musical === 'fifths') intervals = [0, 7];
    if (musical === 'octaves') intervals = [0, 12];
    const wave = voice === 'dirty' || voice === 'pluck' ? 'sawtooth' : voice === 'warm' ? 'triangle' : 'sine';
    const decay = role === 'choir' ? 1.1 : role === 'bass' ? 0.42 : 0.36;
    const gain = (role === 'choir' ? 0.18 : role === 'bass' ? 0.38 : 0.28) * v;
    intervals.forEach((semi, n) => osc(midiToFreq(root + semi) * (voice === 'wide' && n ? 1.006 : 1), wave, decay + n * 0.04, gain / (n ? 1.35 : 1), voice === 'pluck' ? -20 : 0));
    if (voice === 'dirty') osc(midiToFreq(root - 12), 'square', decay * 0.55, gain * 0.18);
  }

  function playSound(i, velocity = 1) {
    if (muted.has(i)) return;
    if (playSample(i, velocity)) return;
    if (bank === 'drums') return drum(i, velocity);
    if (bank === 'bass') return tuned(i, 'bass', velocity);
    if (bank === 'choir') return tuned(i, 'choir', velocity);
    if (bank === 'doom') return tuned(i, i < 8 ? 'bass' : 'choir', velocity);
    if (bank === 'glitch') {
      osc(midiToFreq(scaleMidi(i, 4)), i % 2 ? 'square' : 'triangle', 0.075, 0.2 * velocity, (i % 3 - 1) * 90);
      if (i % 3 === 0) noise(0.055, 7800, 0.1 * velocity);
      return;
    }
    if (bank === 'arcade') {
      osc(midiToFreq(scaleMidi(i, 4)), 'square', 0.16, 0.22 * velocity, 60);
      return osc(midiToFreq(scaleMidi(i, 5)), 'triangle', 0.12, 0.12 * velocity, -40);
    }
    tuned(i, 'sparkle', velocity);
  }

  async function triggerPad(i, velocity = 1) {
    await initAudio();
    if (!audio) return;
    if (audio.state === 'suspended') await audio.resume();
    selectedPad = i;
    recentPads.push(i);
    recentPads = recentPads.slice(-8);
    playSound(i, velocity);
    flashPad(i);
    flashGrid(i);
    if (sparksOn) spawnSparks(i);
    if (confettiOn && Math.random() < 0.18) spawnConfetti(10);
    if (textures.length && Math.random() < 0.25) spawnTexture(i);
    if (flashy && Math.random() < 0.35) flashScreen();
    updateHud();
  }

  function flashPad(i) {
    const p = $('#pads').children[i];
    if (!p) return;
    p.classList.add('hit');
    setTimeout(() => p.classList.remove('hit'), 180);
  }

  function flashGrid(i) {
    [...$('#viz').children].forEach((cell, n) => {
      if ((n + i + step) % 11 === 0) {
        cell.style.setProperty('--cc', colors[i % colors.length]);
        cell.classList.add('on');
        setTimeout(() => cell.classList.remove('on'), 160 + Math.random() * 220);
      }
    });
  }

  function flashScreen() {
    if (safeMode) return;
    const f = $('#fxflash');
    f.classList.remove('on');
    void f.offsetWidth;
    f.classList.add('on');
  }

  function spawnSparks(i) {
    if (safeMode) return;
    const rect = $('#pads').children[i].getBoundingClientRect();
    for (let n = 0; n < 10; n++) {
      const s = document.createElement('div');
      s.className = 'spark';
      s.style.color = colors[(i + n) % colors.length];
      s.style.left = rect.left + rect.width / 2 + 'px';
      s.style.top = rect.top + rect.height / 2 + 'px';
      s.style.setProperty('--dx', Math.random() * 240 - 120 + 'px');
      s.style.setProperty('--dy', Math.random() * 200 - 100 + 'px');
      $('#bursts').appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  }

  function spawnConfetti(amount = 24) {
    if (safeMode) return;
    for (let i = 0; i < amount; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.color = colors[i % colors.length];
      c.style.left = Math.random() * 100 + '%';
      c.style.top = '-20px';
      $('#bursts').appendChild(c);
      setTimeout(() => c.remove(), 1200);
    }
  }

  function spawnTexture(i) {
    if (!textures.length || safeMode) return;
    const t = textures[(i + Math.floor(Math.random() * textures.length)) % textures.length];
    const img = document.createElement('img');
    img.className = 'texture';
    img.src = t.url;
    img.style.left = 15 + Math.random() * 70 + '%';
    img.style.top = 20 + Math.random() * 60 + '%';
    $('#bursts').appendChild(img);
    setTimeout(() => img.remove(), 800);
  }

  function updateFx() {
    fxIds.forEach((id, i) => {
      const el = $('#' + id);
      const knob = $('#toprail').children[i];
      if (el && knob) knob.style.setProperty('--rot', -132 + (+el.value / 100) * 264 + 'deg');
    });
    if (delay) delay.delayTime.value = 0.02 + (+$('#delay').value / 100) * 0.5;
    if (feed) feed.gain.value = (+$('#delay').value / 100) * 0.55;
    if (filter) filter.frequency.value = 260 + (+$('#filter').value / 100) * 9400;
    if (verbSend) verbSend.gain.value = (+$('#verb').value / 100) * 0.55;
    if (master) master.gain.value = +$('#vol').value / 100;
    if (crush) crush.curve = distortionCurve(+$('#crush').value / 100);
  }

  function updateHud() {
    const info = bankInfo[bank];
    $('#bankName').textContent = info[0];
    $('#bankDesc').textContent = info[1];
    $('#bankStatus').textContent = 'bank: ' + info[0];
    $('#modeName').textContent = mode.toUpperCase();
    $('#modeDesc').textContent = { play:'Pads trigger sounds normally.', pattern:'Pads write into sequence.', mute:'Pads toggle silence.', stutter:'Pads repeat quickly.' }[mode];
    $('#modeStatus').textContent = 'mode: ' + mode.toUpperCase();
    $('#selName').textContent = 'PAD ' + String(selectedPad + 1).padStart(2, '0') + ' — ' + padNames[selectedPad];
  }

  function syncSeqPadClasses() {
    for (let i = 0; i < 16; i++) $('#pads').children[i].classList.toggle('seqon', seq.includes(i));
  }

  function panic() {
    clearInterval(timer);
    timer = null;
    seqOn = false;
    arpOn = false;
    $('#seqBtn').textContent = 'SEQ';
    $('#arpBtn').textContent = 'ARP';
    setButton('seqBtn', false);
    setButton('arpBtn', false);
    activeSources.forEach((s) => { try { s.stop(0); } catch (_) {} });
    activeSources = [];
    activeGains.forEach((g) => { try { g.disconnect(); } catch (_) {} });
    activeGains = [];
    document.body.classList.remove('pump','rave','strobe');
    $('#bursts').innerHTML = '';
    log('PANIC // stopped');
  }

  function tick() {
    const s = step % 16;
    if (seqOn && stepsOn[s] && seq[s] != null) triggerPad(seq[s], 0.85);
    if (arpOn && recentPads.length && step % 2 === 0) triggerPad(recentPads[step % recentPads.length], 0.55);
    step = (step + 1) % 16;
  }

  function clock() {
    clearInterval(timer);
    timer = setInterval(tick, 60000 / (+$('#bpm').value || 118) / 4);
  }

  function toggleSeq() {
    seqOn = !seqOn;
    setButton('seqBtn', seqOn);
    $('#seqBtn').textContent = seqOn ? 'SEQ ON' : 'SEQ';
    if (seqOn || arpOn) clock(); else clearInterval(timer);
  }

  function toggleArp() {
    arpOn = !arpOn;
    setButton('arpBtn', arpOn);
    $('#arpBtn').textContent = arpOn ? 'ARP ON' : 'ARP';
    if (seqOn || arpOn) clock(); else clearInterval(timer);
  }

  function setBank(nextBank) {
    bank = nextBank;
    $('#bankSelect').value = nextBank;
    updateHud();
    log('BANK // ' + bankInfo[nextBank][0]);
  }

  function clearPattern() {
    for (let i = 0; i < 16; i++) {
      stepsOn[i] = false;
      seq[i] = null;
      $('#steps').children[i].classList.remove('on');
    }
    syncSeqPadClasses();
  }

  function armStep(s, pad) {
    stepsOn[s] = true;
    seq[s] = pad;
    $('#steps').children[s].classList.add('on');
    syncSeqPadClasses();
  }

  function drumGroove() {
    setBank('drums');
    clearPattern();
    Object.entries({0:0,2:2,3:3,4:1,6:2,8:0,10:2,11:4,12:1,14:2}).forEach(([s, pad]) => armStep(+s, pad));
    if (!seqOn) toggleSeq();
    toast('drum groove');
  }

  function bassLine() {
    setBank('bass');
    clearPattern();
    Object.entries({0:8,3:9,6:10,8:8,11:12,14:11}).forEach(([s, pad]) => armStep(+s, pad));
    if (!seqOn) toggleSeq();
    toast('bass line');
  }

  function usefulDefaults() {
    fxIds.forEach((id, i) => {
      const el = $('#' + id);
      if (el) el.value = fxDefaults[i];
    });
    updateFx();
    toast('useful defaults');
  }

  function preset(name) {
    panic();
    safeMode = false;
    if (name === 'clean') { document.body.dataset.theme = ''; setBank('drums'); usefulDefaults(); }
    if (name === 'db') { usefulDefaults(); drumGroove(); }
    if (name === 'chill') { document.body.dataset.theme = 'midnight'; setBank('choir'); $('#voiceSelect').value = 'wide'; $('#musicalSelect').value = 'chords'; $('#bpm').value = 92; usefulDefaults(); $('#verb').value = 55; updateFx(); }
    if (name === 'arcade') { document.body.dataset.theme = 'casino'; setBank('arcade'); $('#scaleSelect').value = 'pentatonic'; $('#voiceSelect').value = 'pluck'; $('#bpm').value = 132; usefulDefaults(); }
    if (name === 'doom') { document.body.dataset.theme = 'midnight'; setBank('doom'); $('#scaleSelect').value = 'phrygian'; $('#voiceSelect').value = 'dirty'; $('#musicalSelect').value = 'fifths'; $('#bpm').value = 104; usefulDefaults(); $('#crush').value = 28; updateFx(); }
    toast('preset loaded');
  }

  function projectPreset(name) {
    const map = { choppa:'db', overlord:'doom', glitches:'arcade', mattbear:'chill', casino:'arcade', bearcam:'chill' };
    preset(map[name] || 'clean');
    toast(name.toUpperCase() + ' loaded');
  }

  function pool() {
    unsafed();
    flashScreen();
    spawnConfetti(35);
    for (let i = 0; i < 16; i++) setTimeout(() => triggerPad(i, 0.9), i * 45);
  }

  function build() {
    unsafed();
    for (let n = 0; n < 16; n++) setTimeout(() => triggerPad(n % 16, 0.45), n * 90);
  }

  function drop() {
    unsafed();
    flashScreen();
    spawnConfetti(60);
    [0,4,7,10,12,15].forEach((p,n) => setTimeout(() => triggerPad(p,1), n*35));
    setTimeout(pool, 280);
  }

  function mutate() {
    for (let i = 0; i < 16; i++) if (Math.random() < 0.28) {
      stepsOn[i] = !stepsOn[i];
      $('#steps').children[i].classList.toggle('on', stepsOn[i]);
      seq[i] = stepsOn[i] ? Math.floor(Math.random() * 16) : null;
    }
    syncSeqPadClasses();
    toast('mutated');
  }

  function randomize() {
    unsafed();
    setBank(Object.keys(bankInfo)[Math.floor(Math.random() * 7)]);
    ['glow','chaos','delay','filter','crush','motion','verb'].forEach((id) => $('#' + id).value = Math.floor(10 + Math.random() * 70));
    updateFx();
    mutate();
  }

  function calm() {
    safeMode = true;
    confettiOn = false;
    sparksOn = false;
    flashy = false;
    pumpOn = false;
    document.body.classList.remove('pump','rave','strobe');
    ['flashyBtn','confettiBtn','sparkBtn','pumpBtn','raveBtn','strobeBtn'].forEach((id) => setButton(id, false));
    usefulDefaults();
    toast('safe/calm');
    log('SAFE MODE // on');
  }

  async function importFiles(fileList) {
    await initAudio();
    if (!audio) return;
    let slot = samples.filter(Boolean).length, audioCount = 0, imageCount = 0;
    for (const file of fileList) {
      if (file.type.startsWith('audio/')) {
        if (slot >= 16) slot = 0;
        try {
          samples[slot] = await audio.decodeAudioData(await file.arrayBuffer());
          sampleNames[slot] = file.name;
          const pad = $('#pads').children[slot];
          pad.querySelector('.name').textContent = file.name.replace(/\.[^.]+$/, '').slice(0, 18);
          pad.querySelector('.note').textContent = 'sample';
          slot++; audioCount++;
        } catch (_) { log('IMPORT FAILED // ' + file.name); }
      } else if (file.type.startsWith('image/')) {
        textures.push({ url: URL.createObjectURL(file), name: file.name }); imageCount++;
      }
    }
    $('#resList').innerHTML = [
      ...sampleNames.map((n, i) => n ? `<div class="item"><b>PAD ${i+1}: ${n}</b><span>audio</span></div>` : ''),
      ...textures.slice(-8).map((t) => `<div class="item"><b>${t.name}</b><span>image</span></div>`)
    ].join('') || '<div class="small">No imported resources yet.</div>';
    toast(`imported ${audioCount} audio / ${imageCount} images`);
  }

  function makeUI() {
    ['glow','chaos','delay','filter','crush','motion','reverb','volume'].forEach((label, i) => {
      const k = document.createElement('div');
      k.className = 'knob';
      k.innerHTML = `<span>${label}</span>`;
      k.onclick = (e) => {
        const el = $('#' + fxIds[i]);
        if (!el) return;
        el.value = Math.max(0, Math.min(100, +el.value + (e.shiftKey ? -10 : 10)));
        updateFx();
      };
      $('#toprail').appendChild(k);
    });

    padNames.forEach((name, i) => {
      const p = document.createElement('div');
      p.className = 'pad';
      p.style.setProperty('--pc', colors[i % colors.length]);
      p.innerHTML = `<span class="num">PAD ${String(i+1).padStart(2,'0')}</span><span class="key">${padKeys[i].toUpperCase()}</span><span class="name">${name}</span><span class="note">key ${padKeys[i].toUpperCase()}</span><span class="midi">MIDI ${36+i}</span>`;
      p.onclick = (e) => handlePad(i, e.shiftKey);
      $('#pads').appendChild(p);
    });

    for (let i = 0; i < 64; i++) {
      const c = document.createElement('div');
      c.className = 'cell';
      $('#viz').appendChild(c);
    }
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('button');
      s.className = 'step' + (stepsOn[i] ? ' on' : '');
      s.textContent = i + 1;
      s.onclick = () => {
        stepsOn[i] = !stepsOn[i];
        s.classList.toggle('on', stepsOn[i]);
        if (!stepsOn[i]) seq[i] = null;
        syncSeqPadClasses();
      };
      $('#steps').appendChild(s);
    }
    fxIds.forEach((id, i) => {
      const box = document.createElement('div');
      box.innerHTML = `<label class="small">${id.toUpperCase()} <input id="${id}" type="range" min="0" max="100" value="${fxDefaults[i]}"></label>`;
      $('#sliders').appendChild(box);
      box.querySelector('input').oninput = updateFx;
    });
    syncSeqPadClasses();
  }

  async function handlePad(i, stutter = false) {
    if (mode === 'mute') {
      muted.has(i) ? muted.delete(i) : muted.add(i);
      $('#pads').children[i].classList.toggle('muted', muted.has(i));
      return updateHud();
    }
    if (mode === 'pattern') {
      armStep(step % 16, i);
      return triggerPad(i, 0.8);
    }
    if (mode === 'stutter' || stutter) {
      for (let n = 0; n < 6; n++) setTimeout(() => triggerPad(i, 0.8), n * 55);
      return;
    }
    triggerPad(i);
  }

  async function midiConnect() {
    if (!navigator.requestMIDIAccess) { toast('MIDI not supported'); return; }
    try {
      const midi = await navigator.requestMIDIAccess();
      for (const input of midi.inputs.values()) input.onmidimessage = (e) => {
        const [status, note, value] = e.data;
        const command = status & 240;
        if (command === 144 && value > 0) {
          log(`MIDI NOTE // ${note} vel ${value}`);
          if (note >= 36 && note <= 51) handlePad(note - 36);
        }
        if (command === 128 || (command === 144 && value === 0)) log(`MIDI OFF // ${note}`);
        if (command === 176) {
          log(`MIDI CC // ${note} = ${value}`);
          if (note >= 21 && note <= 28) {
            const el = $('#' + fxIds[note - 21]);
            if (el) { el.value = Math.round(value / 127 * 100); updateFx(); }
          }
        }
      };
      $('#midiStatus').textContent = 'midi ready';
      $('#midiStatus').className = 'pill good';
      toast('midi ready');
    } catch (_) { toast('midi blocked'); }
  }

  function bindEvents() {
    $('#startBtn').onclick = initAudio;
    $('#midiBtn').onclick = midiConnect;
    $('#panicBtn').onclick = panic;
    $('#seqBtn').onclick = toggleSeq;
    $('#arpBtn').onclick = toggleArp;
    $('#poolBtn').onclick = pool;
    $('#buildBtn').onclick = build;
    $('#dropBtn').onclick = drop;
    $('#bankSelect').onchange = (e) => setBank(e.target.value);
    $('#bpm').onchange = () => { if (seqOn || arpOn) clock(); };
    $('#usefulBtn').onclick = usefulDefaults;
    $('#drumGrooveBtn').onclick = drumGroove;
    $('#bassLineBtn').onclick = bassLine;
    $('#presetClean').onclick = () => preset('clean');
    $('#presetDrumBass').onclick = () => preset('db');
    $('#presetChill').onclick = () => preset('chill');
    $('#presetArcade').onclick = () => preset('arcade');
    $('#presetDoom').onclick = () => preset('doom');
    ['Choppa','Overlord','Glitches','Mattbear','Casino','Bearcam'].forEach((x) => $('#proj' + x).onclick = () => projectPreset(x.toLowerCase()));
    document.querySelectorAll('[data-mode]').forEach((b) => b.onclick = () => {
      mode = b.dataset.mode;
      document.querySelectorAll('[data-mode]').forEach((x) => x.classList.toggle('active', x === b));
      updateHud();
    });
    $('#pumpBtn').onclick = () => { unsafed(); pumpOn = !pumpOn; document.body.classList.toggle('pump', pumpOn); setButton('pumpBtn', pumpOn); };
    $('#mutateBtn').onclick = mutate;
    $('#randomBtn').onclick = randomize;
    $('#calmBtn').onclick = calm;
    $('#flashyBtn').onclick = () => { unsafed(); flashy = !flashy; confettiOn = flashy; sparksOn = flashy; setButton('flashyBtn', flashy); setButton('confettiBtn', confettiOn); setButton('sparkBtn', sparksOn); };
    $('#raveBtn').onclick = () => { unsafed(); document.body.classList.toggle('rave'); setButton('raveBtn', document.body.classList.contains('rave')); };
    $('#strobeBtn').onclick = () => { unsafed(); document.body.classList.toggle('strobe'); setButton('strobeBtn', document.body.classList.contains('strobe')); };
    $('#confettiBtn').onclick = () => { unsafed(); confettiOn = !confettiOn; setButton('confettiBtn', confettiOn); spawnConfetti(28); };
    $('#sparkBtn').onclick = () => { unsafed(); sparksOn = !sparksOn; setButton('sparkBtn', sparksOn); };
    $('#safeBtn').onclick = calm;
    $('#fileInput').onchange = (e) => importFiles(e.target.files);
    $('#dropZone').onclick = () => $('#fileInput').click();
    $('#dropZone').ondragover = (e) => { e.preventDefault(); $('#dropZone').classList.add('drag'); };
    $('#dropZone').ondragleave = () => $('#dropZone').classList.remove('drag');
    $('#dropZone').ondrop = (e) => { e.preventDefault(); $('#dropZone').classList.remove('drag'); importFiles(e.dataTransfer.files); };
    window.onkeydown = (e) => {
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (['input','select','textarea'].includes(tag) || e.target?.isContentEditable) return;
      const k = e.key.toLowerCase();
      const i = padKeys.indexOf(k);
      if (i >= 0 && !e.repeat) handlePad(i, e.shiftKey);
      if (k === ' ') { e.preventDefault(); pool(); }
      if (k === 'escape') panic();
      if (k === 'enter') toggleSeq();
      if (k === 'tab') { e.preventDefault(); toggleArp(); }
    };
  }

  makeUI();
  updateHud();
  updateFx();
  bindEvents();
})();