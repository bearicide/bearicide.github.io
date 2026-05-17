(() => {
  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // WORD$LOTS
  const slotSymbols = ['🐻', 'WORD', 'PLAY', '🎧', '💿', '⚡', 'BONUS', '🌈', '💀', '🎤', '📼', '🔊'];
  const slotGrid = $('slotGrid');
  const wsCredits = $('wsCredits');
  const wsBet = $('wsBet');
  const wsStatus = $('wsStatus');
  let credits = 50000;
  let betIndex = 3;
  const bets = [0.1, 0.25, 0.5, 1, 2, 5, 10];

  function renderSlots(values = Array.from({ length: 16 }, () => pick(slotSymbols))) {
    if (!slotGrid) return;
    slotGrid.innerHTML = values.map((v) => `<div class="tile">${v}</div>`).join('');
  }

  function updateBet() {
    if (wsBet) wsBet.textContent = bets[betIndex].toFixed(2);
    if (wsCredits) wsCredits.textContent = Math.max(0, Math.round(credits)).toLocaleString();
  }

  function spinSlots() {
    const bet = bets[betIndex];
    if (credits < bet) {
      if (wsStatus) wsStatus.textContent = 'Out of credits. Refresh to reset the prototype.';
      return;
    }
    credits -= bet;
    const values = Array.from({ length: 16 }, () => pick(slotSymbols));
    const joined = values.join(' ');
    let win = 0;
    if (joined.includes('WORD') && joined.includes('PLAY')) win += bet * 1500;
    if (values.filter((v) => v === '🐻').length >= 3) win += bet * 50;
    if (values.filter((v) => v === 'BONUS').length >= 3) win += bet * 40;
    if (values.filter((v) => v === '🎧').length >= 3) win += bet * 18;
    if (win > 0) credits += win;
    renderSlots(values);
    updateBet();
    if (wsStatus) wsStatus.textContent = win ? `BIG WIN: ${Math.round(win).toLocaleString()} credits.` : 'No hit. Spin again.';
  }

  $('wsBetDown')?.addEventListener('click', () => { betIndex = Math.max(0, betIndex - 1); updateBet(); });
  $('wsBetUp')?.addEventListener('click', () => { betIndex = Math.min(bets.length - 1, betIndex + 1); updateBet(); });
  $('wsSpin')?.addEventListener('click', spinSlots);
  renderSlots();
  updateBet();

  // SPELL$LOTS
  const letters = ['W', 'O', 'R', 'D', 'P', 'L', 'A', 'Y'];
  const approved = new Set(['AD', 'AW', 'DO', 'LA', 'OR', 'OW', 'PA', 'YO', 'ADO', 'AWL', 'DAP', 'DAW', 'DAY', 'DRY', 'LAD', 'LAP', 'LAW', 'LAY', 'LOP', 'LOW', 'OAR', 'OLD', 'OWL', 'PAD', 'PAL', 'PAR', 'PAW', 'PAY', 'PLY', 'POD', 'PRO', 'PRY', 'RAD', 'RAP', 'RAW', 'RAY', 'ROD', 'ROW', 'WAD', 'WAR', 'WAY', 'WRY', 'YAP', 'YAW', 'YOW', 'WORD', 'PLAY']);
  const spellReels = $('spellReels');
  const spellWord = $('spellWord');
  const spellStatus = $('spellStatus');
  const spellScore = $('spellScore');
  let built = [];
  let score = 0;

  function renderLetters() {
    if (!spellReels) return;
    spellReels.innerHTML = Array.from({ length: 5 }, () => pick(letters))
      .map((l) => `<button class="letter" type="button">${l}</button>`).join('');
    spellReels.querySelectorAll('.letter').forEach((btn) => btn.addEventListener('click', () => {
      if (built.length < 4) built.push(btn.textContent);
      checkWord();
    }));
  }

  function checkWord() {
    const word = built.join('');
    if (spellWord) spellWord.textContent = word || '_ _ _';
    if (approved.has(word)) {
      const gain = word.length >= 4 ? 100 : word.length === 3 ? 5 : 1;
      score += gain;
      if (spellScore) spellScore.textContent = score;
      if (spellStatus) spellStatus.textContent = `${word} pays ${gain}.`;
      built = [];
      setTimeout(renderLetters, 200);
    } else if (spellStatus) {
      spellStatus.textContent = word ? 'Keep building or clear.' : 'Tap letters to build approved words.';
    }
  }

  $('spellSpin')?.addEventListener('click', () => { built = []; renderLetters(); checkWord(); });
  $('spellClear')?.addEventListener('click', () => { built = []; checkWord(); });
  renderLetters();

  // MINDWARP
  const memoryGrid = $('memoryGrid');
  const mwMatches = $('mwMatches');
  const mwStatus = $('mwStatus');
  const mwReel = $('mwReel');
  let first = null;
  let lock = false;
  let matches = 0;

  function resetMindWarp() {
    if (!memoryGrid) return;
    const deck = ['🐻', '🎧', '💿', '⚡', '🌈', '💀', '🎤', '📼'].flatMap((x) => [x, x]).sort(() => Math.random() - 0.5);
    memoryGrid.innerHTML = deck.map((v) => `<button class="card" type="button" data-value="${v}">?</button>`).join('');
    first = null; lock = false; matches = 0;
    if (mwMatches) mwMatches.textContent = '0';
    if (mwStatus) mwStatus.textContent = 'Find pairs. Each match triggers a bonus reel hit.';
    if (mwReel) mwReel.textContent = 'MATCH A PAIR TO SPIN';
    memoryGrid.querySelectorAll('.card').forEach((card) => card.addEventListener('click', () => flip(card)));
  }

  function flip(card) {
    if (lock || card.classList.contains('matched') || card === first) return;
    card.textContent = card.dataset.value;
    card.classList.add('selected');
    if (!first) { first = card; return; }
    if (first.dataset.value === card.dataset.value) {
      first.classList.add('matched'); card.classList.add('matched');
      first.classList.remove('selected'); card.classList.remove('selected');
      matches += 1;
      if (mwMatches) mwMatches.textContent = matches;
      if (mwReel) mwReel.textContent = `BONUS REEL: ${pick(slotSymbols)}`;
      if (mwStatus) mwStatus.textContent = 'Match hit. Bonus reel fired.';
      first = null;
    } else {
      lock = true;
      setTimeout(() => {
        first.textContent = '?'; card.textContent = '?';
        first.classList.remove('selected'); card.classList.remove('selected');
        first = null; lock = false;
      }, 550);
    }
  }

  $('mwReset')?.addEventListener('click', resetMindWarp);
  resetMindWarp();

  // BUBBLE MOOVIN'
  const canvas = $('bubbleCanvas');
  const bubbleScore = $('bubbleScore');
  const bubbleStatus = $('bubbleStatus');
  const ctx = canvas?.getContext('2d');
  let pops = 0;
  let aimX = 360;
  const colors = ['#ff00de', '#00fff0', '#fff200', '#39ff14', '#ff3b00'];
  let bubbles = [];

  function resetBubbles() {
    bubbles = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 10; c++) bubbles.push({ x: 42 + c * 70 + (r % 2) * 34, y: 38 + r * 54, color: pick(colors), live: true });
    }
    pops = 0;
    if (bubbleScore) bubbleScore.textContent = pops;
    drawBubbles();
  }

  function drawBubbles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    bubbles.filter((b) => b.live).forEach((b) => {
      ctx.beginPath(); ctx.arc(b.x, b.y, 24, 0, Math.PI * 2); ctx.fillStyle = b.color; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();
    });
    ctx.beginPath(); ctx.moveTo(360, 440); ctx.lineTo(aimX, 250); ctx.strokeStyle = '#fff200'; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.arc(360, 440, 22, 0, Math.PI * 2); ctx.fillStyle = '#00fff0'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.stroke();
  }

  canvas?.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    aimX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    drawBubbles();
  });
  $('bubbleShoot')?.addEventListener('click', () => {
    const live = bubbles.filter((b) => b.live);
    if (!live.length) { if (bubbleStatus) bubbleStatus.textContent = 'Board clear. Reset for another round.'; return; }
    const target = live.reduce((best, b) => Math.abs(b.x - aimX) < Math.abs(best.x - aimX) ? b : best, live[0]);
    target.live = false; pops += 1;
    if (bubbleScore) bubbleScore.textContent = pops;
    if (bubbleStatus) bubbleStatus.textContent = `POP ${pops}. Keep clearing bubbles.`;
    drawBubbles();
  });
  $('bubbleReset')?.addEventListener('click', resetBubbles);
  resetBubbles();
})();
