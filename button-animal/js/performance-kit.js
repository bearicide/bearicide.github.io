// BUTTON ANIMAL fixed 16-pad performance kit
// Makes the visible Launchkey map true:
// 1 Kick2, 2 Snare2, 3 Hat2, 4 Hat2B, 5 Synth1, 6 Synth2, 7 Pad3, 8 Pad4
// 9 Kick, 10 Snare, 11 Hat, 12 HatB, 13 Bass1, 14 Bass2, 15 FX1, 16 FX2
// Loaded after sample-chop: if chops are active, sample-chop wins.
(() => {
  const $ = (s) => document.querySelector(s);
  const padKeys = ['1','2','3','4','q','w','e','r','a','s','d','f','z','x','c','v'];
  const roles = ['Kick 2','Snare 2','Hat 2','Hat 2B','Synth 1','Synth 2','Pad 3','Pad 4','Kick','Snare','Hat','Hat B','Bass 1','Bass 2','FX 1','FX 2'];
  let ctx, master, delay, feedback;

  async function audio() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      delay = ctx.createDelay();
      feedback = ctx.createGain();
      master.gain.value = 0.82;
      delay.delayTime.value = 0.145;
      feedback.gain.value = 0.18;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(master);
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx;
  }

  function val(id, fallback) {
    const el = $('#' + id);
    return el ? Number(el.value || fallback) / 100 : fallback / 100;
  }

  function log(text) {
    const r = $('#readout');
    if (r) r.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}<br>` + r.innerHTML.split('<br>').slice(0, 7).join('<br>');
  }

  function flashPad(i) {
    const pad = document.querySelectorAll('.pad')[i];
    if (!pad) return;
    pad.classList.add('hit');
    setTimeout(() => pad.classList.remove('hit'), 150);
    const selected = $('#selName');
    if (selected) selected.textContent = `PAD ${String(i + 1).padStart(2, '0')} — ${roles[i]}`;
  }

  function env(gain, dur, toDelay = false) {
    const now = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    g.connect(master);
    if (toDelay) g.connect(delay);
    setTimeout(() => { try { g.disconnect(); } catch (_) {} }, (dur + .2) * 1000);
    return g;
  }

  function osc(freq, type, dur, gain, bend = 0, toDelay = false) {
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    if (bend) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + bend), now + dur * .7);
    o.connect(env(gain, dur, toDelay));
    o.start(now);
    o.stop(now + dur + .02);
  }

  function noise(dur, gain, tone = 6000, hp = false) {
    const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    const src = ctx.createBufferSource();
    const f = ctx.createBiquadFilter();
    f.type = hp ? 'highpass' : 'bandpass';
    f.frequency.value = tone;
    f.Q.value = hp ? .7 : 2.6;
    src.buffer = buffer;
    src.connect(f);
    f.connect(env(gain, dur));
    src.start();
  }

  function kick2(v) { osc(150, 'sine', .22, .88 * v, -105); osc(54, 'sine', .28, .38 * v, -10); }
  function kick(v) { osc(108, 'sine', .34, .95 * v, -75); }
  function snare2(v) { noise(.16, .30 * v, 2400); osc(220, 'triangle', .10, .18 * v, -40); }
  function snare(v) { noise(.13, .36 * v, 1800); osc(175, 'triangle', .09, .20 * v, -24); }
  function hat2(v) { noise(.045, .14 * v, 9000, true); }
  function hat2b(v) { noise(.10, .16 * v, 7600, true); }
  function hat(v) { noise(.055, .18 * v, 8600, true); }
  function hatb(v) { noise(.22, .20 * v, 6800, true); }
  function synth(n, v) { const base = 220 * Math.pow(2, n / 12); osc(base, 'sawtooth', .28, .22 * v, -12, true); osc(base * 1.505, 'triangle', .30, .12 * v, 0, true); }
  function pad(n, v) { const base = 196 * Math.pow(2, n / 12); [0, 4, 7].forEach((s, k) => osc(base * Math.pow(2, s / 12), 'triangle', .95 + k * .04, .10 * v, 0, true)); }
  function bass(n, v) { const base = [55, 65.41][n] || 55; osc(base, 'square', .34, .34 * v, -8); osc(base * .5, 'sine', .38, .26 * v, -5); }
  function fx(n, v) { if (n === 0) { noise(.20, .20 * v, 1200); osc(880, 'square', .18, .12 * v, -500, true); } else { osc(110, 'sawtooth', .42, .22 * v, 330, true); noise(.16, .14 * v, 5000); } }

  async function play(i, velocity = 1) {
    await audio();
    const v = Math.max(.05, Math.min(1, velocity));
    const crush = val('crush', 6);
    const delayMix = val('delay', 22);
    master.gain.value = .70 + val('vol', 72) * .32;
    feedback.gain.value = .08 + delayMix * .28;
    if (crush > .35) master.gain.value *= .86;

    if (i === 0) kick2(v);
    else if (i === 1) snare2(v);
    else if (i === 2) hat2(v);
    else if (i === 3) hat2b(v);
    else if (i === 4) synth(0, v);
    else if (i === 5) synth(5, v);
    else if (i === 6) pad(0, v);
    else if (i === 7) pad(5, v);
    else if (i === 8) kick(v);
    else if (i === 9) snare(v);
    else if (i === 10) hat(v);
    else if (i === 11) hatb(v);
    else if (i === 12) bass(0, v);
    else if (i === 13) bass(1, v);
    else if (i === 14) fx(0, v);
    else if (i === 15) fx(1, v);

    flashPad(i);
    log(`KIT // PAD ${String(i + 1).padStart(2, '0')} = ${roles[i]}`);
  }

  function isChopActive() {
    const note = document.querySelector('.pad .note')?.textContent?.trim().toLowerCase();
    return note === 'chop';
  }

  function wirePads() {
    document.querySelectorAll('.pad').forEach((pad, i) => {
      pad.addEventListener('click', (e) => {
        if (isChopActive()) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        play(i, e.shiftKey ? .62 : 1);
      }, true);
    });
  }

  function wireKeys() {
    window.addEventListener('keydown', (e) => {
      if (isChopActive() || e.repeat) return;
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (['input','select','textarea'].includes(tag) || e.target?.isContentEditable) return;
      const i = padKeys.indexOf(e.key.toLowerCase());
      if (i < 0) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      play(i, e.shiftKey ? .62 : 1);
    }, true);
  }

  window.BAPlayPerformancePad = play;

  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      wirePads();
      wireKeys();
      log('KIT MAP // PAD 01 = Kick 2');
    });
  });
})();
