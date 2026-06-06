// BUTTON ANIMAL pad label helper
// Keeps visible pad labels matched to the selected bank.
// Imported samples still win: any pad marked NOTE=sample keeps its sample filename label.
(() => {
  const $ = (s) => document.querySelector(s);

  const labels = {
    drums: ['Kick','Snare','Closed Hat','Open Hat','Clap','Perc','Tom Low','Tom High','Sub Hit','Zap','Noise Pop','Metal Tick','Riser','Reverse','Impact','FX Hit'],
    bass: ['Bass Root','Bass 2nd','Bass Min3','Bass 4th','Bass 5th','Bass Min6','Bass Min7','Bass Oct','Bass Low','Bass Walk','Bass Jump','Bass Slide','Bass Pulse','Bass Drone','Bass Bite','Bass Drop'],
    glitch: ['Glitch 1','Glitch 2','Bit Click','Data Snap','Tape Skip','Static Pop','Shard','Error Bell','Stutter A','Stutter B','Buffer','Scrape','Zaplet','Crackle','Glass Bug','Crash FX'],
    choir: ['Pad I','Pad II','Pad III','Pad IV','Fifth Pad','Wide Pad','Soft Vox','Ghost Vox','Chord Low','Chord Mid','Chord High','Air Bed','Drone I','Drone II','Bloom','Heaven FX'],
    arcade: ['Coin','Jump','Laser','Power Up','Chip Bass','Chip Lead','Square 1','Square 2','Bonus','Menu Blip','8bit Tom','Pixel Bell','Boss Hit','Life Up','Warp','Game Over'],
    doom: ['Doom Root','Doom Fifth','Dark Chord','Low Drone','Grave Hit','Iron Bell','Rumble','Void Pad','Sub Crush','Black Lead','Worm Note','Ash Chord','Cave Rise','Bone Click','Final Hit','Abyss FX'],
    sparkle: ['Bell 1','Bell 2','Glass 1','Glass 2','Pluck 1','Pluck 2','Star Note','Shimmer','Tiny Lead','Dream Hit','Twinkle','Chime','Bright Pad','Glow','Dust','Magic FX']
  };

  function currentBank() {
    return $('#bankSelect')?.value || 'drums';
  }

  function isSamplePad(pad) {
    return (pad.querySelector('.note')?.textContent || '').trim().toLowerCase() === 'sample';
  }

  function updatePadLabels() {
    const bank = currentBank();
    const set = labels[bank] || labels.drums;
    document.querySelectorAll('.pad').forEach((pad, i) => {
      if (isSamplePad(pad)) return;
      const name = pad.querySelector('.name');
      const note = pad.querySelector('.note');
      if (name) name.textContent = set[i] || `Pad ${i + 1}`;
      if (note) note.textContent = bank;
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
