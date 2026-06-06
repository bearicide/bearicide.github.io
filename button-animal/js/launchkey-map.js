// BUTTON ANIMAL Launchkey Mini hardware map override
// Launchkey Components layout:
// top row pads 1-8  => MIDI 44-51
// bottom row pads 9-16 => MIDI 36-43
(() => {
  const $ = (s) => document.querySelector(s);

  function noteToPadIndex(note) {
    if (note >= 44 && note <= 51) return note - 44;       // visual top row: pads 1-8
    if (note >= 36 && note <= 43) return 8 + (note - 36);  // visual bottom row: pads 9-16
    return -1;
  }

  function log(text) {
    const r = $('#readout');
    if (r) r.innerHTML = `[${new Date().toLocaleTimeString()}] ${text}<br>` + r.innerHTML.split('<br>').slice(0, 7).join('<br>');
  }

  function flashPad(index) {
    const pad = document.querySelectorAll('.pad')[index];
    if (!pad) return;
    pad.classList.add('hit');
    setTimeout(() => pad.classList.remove('hit'), 180);
    const selected = $('#selName');
    const label = pad.querySelector('.name')?.textContent || `Pad ${index + 1}`;
    if (selected) selected.textContent = `PAD ${String(index + 1).padStart(2, '0')} — ${label}`;
  }

  function clickPad(index) {
    const pad = document.querySelectorAll('.pad')[index];
    if (!pad) return;
    pad.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window }));
    flashPad(index);
  }

  async function installLaunchkeyMap() {
    if (!navigator.requestMIDIAccess) return;
    try {
      const midi = await navigator.requestMIDIAccess();
      for (const input of midi.inputs.values()) {
        input.onmidimessage = (e) => {
          const [status, data1, data2] = e.data;
          const cmd = status & 240;
          if (cmd === 144 && data2 > 0) {
            const padIndex = noteToPadIndex(data1);
            log(`LK NOTE // ${data1} -> PAD ${padIndex + 1}`);
            if (padIndex >= 0) clickPad(padIndex);
          } else if (cmd === 176) {
            log(`LK CC // ${data1} = ${data2}`);
            if (data1 >= 21 && data1 <= 28) {
              const ids = ['glow','chaos','delay','filter','crush','motion','verb','vol'];
              const el = $('#' + ids[data1 - 21]);
              if (el) {
                el.value = Math.round(data2 / 127 * 100);
                el.dispatchEvent(new Event('input', { bubbles:true }));
              }
            }
          }
        };
      }
      log('LAUNCHKEY MAP // top 44-51, bottom 36-43');
    } catch (err) {
      log('LAUNCHKEY MAP // blocked');
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const midiBtn = $('#midiBtn');
    if (midiBtn) midiBtn.addEventListener('click', () => setTimeout(installLaunchkeyMap, 120), true);
    setTimeout(installLaunchkeyMap, 1200);
  });
})();
