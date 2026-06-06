// BUTTON ANIMAL pad label helper
// Keeps visible pad labels matched to the selected bank.
// Imported samples/chops still win: any pad marked NOTE=sample or NOTE=chop keeps its loaded-file label.
(() => {
  const $ = (s) => document.querySelector(s);

  const labels = {
    drums: ['Kick 2','Snare 2','Hat 2','Hat 2B','Synth 1','Synth 2','Pad 3','Pad 4','Kick','Snare','Hat','Hat B','Bass 1','Bass 2','FX 1','FX 4'],
    bass: ['Kick 2','Snare 2','Hat 2','Hat 2B','Synth 1','Synth 2','Pad 3','Pad 4','Kick','Snare','Hat','Hat B','Bass 1','Bass 2','FX 1','FX 4'],
    glitch: ['Kick 2','Snare 2','Hat 2','Hat 2B','Synth 1','Synth 2','Pad 3','Pad 4','Kick','Snare','Hat','Hat B','Bass 1','Bass 2','FX 1','FX 4'],
    choir: ['Kick 2','Snare 2','Hat 2','Hat 2B','Synth 1','Synth 2','Pad 3','Pad 4','Kick','Snare','Hat','Hat B','Bass 1','Bass 2','FX 1','FX 4'],
    arcade: ['Kick 2','Snare 2','Hat 2','Hat 2B','Synth 1','Synth 2','Pad 3','Pad 4','Kick','Snare','Hat','Hat B','Bass 1','Bass 2','FX 1','FX 4'],
    doom: ['Kick 2','Snare 2','Hat 2','Hat 2B','Synth 1','Synth 2','Pad 3','Pad 4','Kick','Snare','Hat','Hat B','Bass 1','Bass 2','FX 1','FX 4'],
    sparkle: ['Kick 2','Snare 2','Hat 2','Hat 2B','Synth 1','Synth 2','Pad 3','Pad 4','Kick','Snare','Hat','Hat B','Bass 1','Bass 2','FX 1','FX 4']
  };

  function currentBank() {
    return $('#bankSelect')?.value || 'drums';
  }

  function isLoadedPad(pad) {
    const note = (pad.querySelector('.note')?.textContent || '').trim().toLowerCase();
    return note === 'sample' || note === 'chop';
  }

  function updatePadLabels() {
    const bank = currentBank();
    const set = labels[bank] || labels.drums;
    document.querySelectorAll('.pad').forEach((pad, i) => {
      if (isLoadedPad(pad)) return;
      const name = pad.querySelector('.name');
      const note = pad.querySelector('.note');
      if (name) name.textContent = set[i] || `Pad ${i + 1}`;
      if (note) note.textContent = i < 8 ? 'top row' : 'bottom row';
    });

    const selected = $('#selName');
    if (selected) {
      const match = selected.textContent.match(/PAD\s+(\d+)/i);
      if (match) {
        const padIndex = Math.max(0, Math.min(15, Number(match[1]) - 1));
        const pad = document.querySelectorAll('.pad')[padIndex];
        const visibleName = pad?.querySelector('.name')?.textContent || set[padIndex] || `Pad ${padIndex + 1}`;
        selected.textContent = `PAD ${String(padIndex + 1).padStart(2, '0')} — ${visibleName}`;
      }
    }
  }

  function delayedUpdate() {
    requestAnimationFrame(() => requestAnimationFrame(updatePadLabels));
  }

  window.addEventListener('DOMContentLoaded', () => {
    delayedUpdate();
    $('#bankSelect')?.addEventListener('change', delayedUpdate);
    document.querySelectorAll('#presetClean,#presetDrumBass,#presetChill,#presetArcade,#presetDoom,#projChoppa,#projOverlord,#projGlitches,#projMattbear,#projCasino,#projBearcam')
      .forEach((btn) => btn.addEventListener('click', () => setTimeout(updatePadLabels, 80)));

    const pads = $('#pads');
    if (pads) {
      new MutationObserver(delayedUpdate).observe(pads, { childList: true, subtree: true, characterData: true });
    }
  });
})();
