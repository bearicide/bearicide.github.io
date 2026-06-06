// BUTTON ANIMAL pad owner
// Loaded last. Removes older pad/key handlers by replacing pad nodes,
// then routes pads/keyboard to the fixed performance kit only.
(() => {
  const padKeys = ['1','2','3','4','q','w','e','r','a','s','d','f','z','x','c','v'];

  function $(s) { return document.querySelector(s); }

  function log(text) {
    const r = $('#readout');
    if (r) r.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}<br>` + r.innerHTML.split('<br>').slice(0, 7).join('<br>');
  }

  function play(index, velocity = 1) {
    if (typeof window.BAPlayPerformancePad === 'function') {
      window.BAPlayPerformancePad(index, velocity);
    } else {
      log(`PAD OWNER // kit missing for pad ${index + 1}`);
    }
  }

  function cleanPadNodes() {
    const pads = [...document.querySelectorAll('.pad')];
    pads.forEach((pad, index) => {
      const clone = pad.cloneNode(true);
      clone.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        play(index, e.shiftKey ? 0.62 : 1);
      }, true);
      pad.replaceWith(clone);
    });
  }

  function cleanKeyboard() {
    // app.js used window.onkeydown; kill that one specifically.
    window.onkeydown = null;

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (['input','select','textarea'].includes(tag) || e.target?.isContentEditable) return;
      const index = padKeys.indexOf(e.key.toLowerCase());
      if (index < 0) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      play(index, e.shiftKey ? 0.62 : 1);
    }, true);
  }

  window.addEventListener('DOMContentLoaded', () => {
    // Let app.js build the pads first, then take ownership.
    setTimeout(() => {
      cleanPadNodes();
      cleanKeyboard();
      log('PAD OWNER // single kit routing active');
    }, 250);
  });
})();
