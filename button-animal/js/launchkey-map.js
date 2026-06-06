// BUTTON ANIMAL Launchkey Mini hardware map override
// Copied from /the-launcha/ layout:
// top row pads 1-8    => MIDI 40,41,42,43,48,49,50,51
// bottom row pads 9-16 => MIDI 36,37,38,39,44,45,46,47
(() => {
  const $ = (s) => document.querySelector(s);
  const noteMap = {
    40:0, 41:1, 42:2, 43:3, 48:4, 49:5, 50:6, 51:7,
    36:8, 37:9, 38:10, 39:11, 44:12, 45:13, 46:14, 47:15
  };

  function noteToPadIndex(note) {
    return Number.isInteger(noteMap[note]) ? noteMap[note] : -1;
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
      log('LAUNCHKEY MAP // Launcha notes active');
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
